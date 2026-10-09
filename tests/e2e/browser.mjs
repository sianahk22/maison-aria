// Mini client WebDriver BiDi : pilote Firefox (mode sans fenêtre) pour les tests de bout en bout.
// Aucune dépendance : utilise le protocole standard intégré à Firefox et le WebSocket natif de Node.
// Prérequis : Firefox installé. Lancement : npm run test:e2e (voir tests/e2e/run.mjs).
import { execSync, spawn } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'

export const BASE = process.env.E2E_BASE_URL ?? 'http://localhost:4199'
// Dossier de profil NON caché : Firefox installé en « snap » ne peut pas écrire dans ~/.xxx
const PROFILE = process.env.E2E_FIREFOX_PROFILE ?? join(homedir(), 'maison-aria-e2e-profile')
const SHOTS = process.env.E2E_SCREENSHOTS ?? join(tmpdir(), 'maison-aria-e2e')
const PORT = 9333
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function launchBrowser() {
  try { execSync('pkill -f "[m]aison-aria-e2e-profile"') } catch { /* aucun Firefox de test en cours */ }
  rmSync(PROFILE, { recursive: true, force: true })
  mkdirSync(PROFILE, { recursive: true })
  const firefox = spawn('firefox', ['--headless', '--no-remote', '--profile', PROFILE, '--remote-debugging-port', String(PORT)], { stdio: 'ignore' })

  let socket
  for (let attempt = 0; attempt < 60 && !socket; attempt++) {
    await sleep(500)
    try {
      const candidate = new WebSocket(`ws://127.0.0.1:${PORT}/session`)
      await new Promise((resolve, reject) => { candidate.onopen = resolve; candidate.onerror = reject })
      socket = candidate
    } catch { /* Firefox démarre encore */ }
  }
  if (!socket) throw new Error('Impossible de se connecter à Firefox (WebDriver BiDi)')

  let nextId = 0
  const pending = new Map()
  const logs = []
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data)
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id)
      pending.delete(message.id)
      message.type === 'error' ? reject(new Error(`${message.error}: ${message.message}`)) : resolve(message.result)
    } else if (message.method === 'log.entryAdded') {
      logs.push(`${message.params.level}: ${message.params.text}`)
    }
  }
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++nextId
      pending.set(id, { resolve, reject })
      socket.send(JSON.stringify({ id, method, params }))
    })

  await send('session.new', { capabilities: {} })
  await send('session.subscribe', { events: ['log.entryAdded'] })
  const { context } = await send('browsingContext.create', { type: 'tab' })

  const page = {
    logs,
    errors: () => logs.filter((line) => line.startsWith('error')),
    viewport: (width, height) => send('browsingContext.setViewport', { context, viewport: { width, height } }),
    async goto(path) {
      await send('browsingContext.navigate', { context, url: BASE + path, wait: 'complete' })
      await sleep(700)
    },
    // Exécute du code dans la page ; la valeur renvoyée doit être sérialisable en JSON.
    async eval(code) {
      const result = await send('script.evaluate', {
        expression: `(async () => JSON.stringify(await (async () => { ${code} })()))()`,
        target: { context },
        awaitPromise: true,
      })
      if (result.type === 'exception') throw new Error(`JS : ${result.exceptionDetails?.text ?? 'exception'}`)
      const value = result.result?.value
      return value === undefined ? undefined : JSON.parse(value)
    },
    text: (selector) => page.eval(`return document.querySelector(${JSON.stringify(selector)})?.textContent?.trim()`),
    click: (selector) => page.eval(`const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return 'absent'; el.click(); return 'ok'`),
    clickText: (label, selector = 'button,a') =>
      page.eval(`const el = [...document.querySelectorAll(${JSON.stringify(selector)})]
        .find((e) => e.textContent.replace(/\\s+/g, ' ').trim().includes(${JSON.stringify(label)}) && !e.disabled)
        if (!el) return 'absent'; el.click(); return 'ok'`),
    // Saisie compatible avec les champs contrôlés de React.
    type: (selector, value) =>
      page.eval(`const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return 'absent'
        const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype
        Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${JSON.stringify(value)})
        el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true })); return 'ok'`),
    async key(value) {
      await send('input.performActions', { context, actions: [{ type: 'key', id: 'clavier', actions: [{ type: 'keyDown', value }, { type: 'keyUp', value }] }] })
      await sleep(150)
    },
    async screenshot(name) {
      mkdirSync(SHOTS, { recursive: true })
      const { data } = await send('browsingContext.captureScreenshot', { context })
      writeFileSync(join(SHOTS, `${name}.png`), Buffer.from(data, 'base64'))
    },
    wait: sleep,
    async close() {
      try { await send('session.end') } catch { /* déjà fermée */ }
      socket.close()
      firefox.kill()
      await sleep(500)
      try { execSync('pkill -f "[m]aison-aria-e2e-profile"') } catch { /* déjà fermé */ }
      rmSync(PROFILE, { recursive: true, force: true })
    },
  }
  return page
}

export const KEYS = { tab: '', enter: '', escape: '' }
