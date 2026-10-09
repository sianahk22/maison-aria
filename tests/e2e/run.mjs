// Tests de bout en bout : parcours principaux + audit responsive et accessibilité (10 routes × 5 largeurs).
// Usage : npm run build && npm run test:e2e        (Firefox requis)
// Contre le site en ligne : E2E_BASE_URL=https://… npm run test:e2e
import { spawn } from 'node:child_process'
import { BASE, KEYS, launchBrowser } from './browser.mjs'

let passed = 0
let failed = 0
const check = (label, condition, detail = '') => {
  condition ? passed++ : failed++
  console.log(`${condition ? '✅' : '❌'} ${label}${detail ? ` — ${detail}` : ''}`)
}

async function ensureServer() {
  try { await fetch(BASE); return null } catch { /* à démarrer */ }
  const server = spawn('npx', ['vite', 'preview', '--port', '4199', '--strictPort'], { stdio: 'ignore', detached: true })
  for (let i = 0; i < 40; i++) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    try { await fetch(BASE); return server } catch { /* attente */ }
  }
  throw new Error(`Serveur injoignable : ${BASE}`)
}

const server = await ensureServer()
const page = await launchBrowser()
await page.viewport(1280, 900)
const userBookings = `return (JSON.parse(localStorage.getItem('aura-studio:bookings'))?.state.bookings ?? []).filter((b) => b.source === 'user' && b.status === 'confirmed').length`

// ── Navigation et 404 ──────────────────────────────────────────────────────
await page.goto('/')
check('Accueil : slogan', (await page.text('h1')) === 'Des intérieurs pensés pour durer.')
check('Mention « Projet personnel de démonstration — Maison Aria »', await page.eval(`return document.body.textContent.includes('Projet personnel de démonstration — Maison Aria')`))
for (const [label, path] of [['Collection', '/shop'], ['ARIA Concierge', '/concierge'], ['Consultations', '/booking']]) {
  await page.goto('/')
  await page.clickText(label, 'header nav a')
  await page.wait(700)
  check(`Menu « ${label} »`, (await page.eval('return location.pathname')) === path)
}
await page.goto('/n-existe-pas')
check('URL inconnue → 404', (await page.text('h1')) === 'Page introuvable')
await page.goto('/shop/inconnu')
check('Produit inconnu → 404 produit', (await page.text('h1')) === 'Produit introuvable')

// ── Boutique ───────────────────────────────────────────────────────────────
await page.goto('/shop')
check('Boutique : 19 produits', (await page.eval(`return document.querySelectorAll('main article').length`)) === 19)
await page.type('#shop-search', 'chêne'); await page.wait(300)
const oak = await page.eval(`return [...document.querySelectorAll('main article h2')].map((h) => h.textContent)`)
check('Recherche « chêne » (matériaux)', oak.length > 0, oak.join(', '))
await page.type('#shop-search', 'zzzz'); await page.wait(300)
check('État vide', (await page.text('main h2')) === 'Aucun produit ne correspond')
await page.clickText('Réinitialiser les filtres'); await page.wait(300)
await page.click('input[value=exterieur]'); await page.wait(300)
check('Filtre Extérieur', await page.eval(`return [...document.querySelectorAll('main article p.uppercase')].every((p) => p.textContent === 'Extérieur')`))
await page.type('#shop-sort', 'price-desc'); await page.wait(300)
const prices = await page.eval(`return [...document.querySelectorAll('main article h2 + p')].map((p) => parseInt(p.textContent.replace(/\\D/g, '')))`)
check('Tri prix décroissant', prices.every((price, i) => i === 0 || prices[i - 1] >= price), prices.join(' ≥ '))

// ── Fiche produit et panier ────────────────────────────────────────────────
await page.goto('/shop/canape-lune')
check('Fiche : « Demander conseil à ARIA Concierge »', await page.eval(`return [...document.querySelectorAll('a')].some((a) => a.textContent.includes('Demander conseil à ARIA Concierge'))`))
await page.clickText('Vue rapprochée'); await page.wait(300)
check('Galerie : vue rapprochée', (await page.eval(`return document.querySelector('main img').getAttribute('src')`)).endsWith('-detail.webp'))
await page.clickText('Augmenter la quantité'); await page.wait(100)
await page.clickText('Ajouter au panier : Canapé Lune'); await page.wait(300)
check('Ajout au panier (quantité 2) + compteur', (await page.text('header a[href="/cart"] .sr-only')) === 'Panier, 2 articles')
await page.goto('/shop/suspension-lin')
check('Produit indisponible : bouton désactivé', await page.eval(`return [...document.querySelectorAll('main button')].find((b) => b.textContent.includes('Indisponible'))?.disabled === true`))
await page.goto('/cart')
check('Panier conservé après rechargement', (await page.eval(`return document.querySelector('#quantity-canape-lune')?.value`)) === '2')
const totals = (await page.eval(`return [...document.querySelectorAll('aside dd')].map((d) => d.textContent)`)).map((t) => t.replace(/\s/g, ' '))
check('Totaux : 2 × 2 290 € = 4 580 €, livraison offerte', totals.join('|') === '4 580 €|Offerte|4 580 €', totals.join(' | '))
await page.clickText('Passer à la commande'); await page.wait(300)
check('Commande : paiement non connecté', (await page.eval(`return document.querySelector('dialog[open] strong')?.textContent`)) === 'Le paiement n’est pas connecté dans cette démonstration.')
await page.key(KEYS.escape)
check('Échap ferme la modale', !(await page.eval('return document.querySelector("dialog").open')))
await page.clickText('Supprimer Canapé Lune'); await page.wait(300)
check('Suppression → panier vide', (await page.text('h1')) === 'Votre panier est vide')

// ── Réservation ────────────────────────────────────────────────────────────
async function fillBooking(type, consultant, format, email) {
  await page.click(`input[name=consultation-type][value=${type}]`); await page.wait(100)
  await page.click(`input[name=consultant][value=${consultant}]`); await page.wait(100)
  await page.click(`input[name=format][value=${format}]`); await page.wait(100)
  await page.click('input[name=booking-day]:not(:disabled)'); await page.wait(150)
  const slot = await page.eval(`const el = document.querySelector('input[name=booking-slot]:not(:disabled)'); el.click(); return el.value`)
  await page.type('#booking-name', 'Client Démo')
  await page.type('#booking-email', email)
  return slot
}
await page.goto('/booking')
check('Avis « Réservation de démonstration »', await page.eval(`return document.body.textContent.includes('aucun rendez-vous réel ne sera créé')`))
await page.click('form button[type=submit]'); await page.wait(200)
check('Formulaire vide → alerte', /Il manque encore/.test(await page.text('[role=alert]')))
const slot = await fillBooking('projet-amenagement', 'clara', 'visio', 'client@exemple.fr')
await page.click('form button[type=submit]'); await page.wait(300)
check('Récapitulatif', (await page.text('main h2')) === 'Vérifiez votre réservation')
await page.eval(`const b = [...document.querySelectorAll('button')].find((e) => e.textContent.includes('Confirmer la réservation')); b.click(); b.click(); b.click(); return 1`)
await page.wait(1300)
check('Triple-clic → une seule réservation', (await page.text('main h2')) === 'Réservation confirmée' && (await page.eval(userBookings)) === 1)
await page.clickText('Faire une nouvelle réservation'); await page.wait(300)
await page.click('input[name=consultation-type][value=projet-amenagement]'); await page.click('input[name=consultant][value=clara]'); await page.wait(100)
await page.click('input[name=booking-day]:not(:disabled)'); await page.wait(150)
check('Créneau réservé désormais indisponible', await page.eval(`return document.querySelector('input[name=booking-slot][value="${slot}"]')?.disabled === true`))
await page.goto('/booking')
await fillBooking('decouverte', 'hugo', 'boutique', 'sam@exemple.fr')
await page.click('form button[type=submit]'); await page.wait(300)
await page.clickText('Simuler une réservation concurrente'); await page.wait(200)
await page.clickText('Confirmer la réservation'); await page.wait(1300)
check('Concurrence → la deuxième vérification refuse', /vient d’être réservé/.test(await page.text('[role=alert]')))

// ── ARIA Concierge ─────────────────────────────────────────────────────────
await page.goto('/concierge')
const mode = await page.eval(`return document.querySelector('#chat-title + p')?.textContent`)
check('Mode ARIA affiché', Boolean(mode), mode)
const suggestions = await page.eval(`return [...document.querySelectorAll('[aria-label="Suggestions de questions"] button')].map((b) => b.textContent)`)
check('Questions rapides = exemples du cahier des charges', suggestions.includes('Quel objet convient à un intérieur minimaliste ?') && suggestions.includes('Je souhaite prendre rendez-vous.'))
for (const question of suggestions) {
  await page.clickText(question); await page.wait(200)
  const thinking = await page.eval(`return document.body.textContent.includes('ARIA prépare une réponse')`)
  for (let i = 0; i < 30 && (await page.eval(`return document.body.textContent.includes('ARIA prépare une réponse')`)); i++) await page.wait(500)
  const last = await page.eval(`const li = [...document.querySelectorAll('[role=log] > li')].at(-1)
    return { recos: [...li.querySelectorAll('article h3')].map((h) => h.textContent), rdv: [...li.querySelectorAll('a')].some((a) => a.textContent.includes('Prendre rendez-vous')) }`)
  check(`ARIA « ${question} »`, thinking && (last.recos.length > 0 || last.rdv), `${last.recos.join(', ')}${last.rdv ? ' [Prendre rendez-vous]' : ''}`)
}

// ── Espace client ──────────────────────────────────────────────────────────
await page.goto('/account')
check('Compte : aucune authentification réelle annoncée', /Aucune authentification réelle/.test(await page.eval('return document.querySelector("main").textContent')))
check('Compte : 1 rendez-vous à venir', (await page.eval(`return document.querySelectorAll('[aria-labelledby=upcoming-title] article').length`)) === 1)
await page.clickText('Modifier', 'a'); await page.wait(600)
await page.eval(`[...document.querySelectorAll('input[name=booking-day]:not(:disabled)')][1].click(); return 1`); await page.wait(150)
await page.click('input[name=booking-slot]:not(:disabled)')
await page.click('form button[type=submit]'); await page.wait(300)
await page.clickText('Confirmer la réservation'); await page.wait(1300)
check('Modification confirmée', (await page.text('main h2')) === 'Rendez-vous modifié')
await page.goto('/account')
await page.clickText('Annuler'); await page.wait(150)
await page.clickText('Confirmer l’annulation'); await page.wait(900)
check('Annulation → plus de rendez-vous à venir', (await page.eval(`return document.querySelectorAll('[aria-labelledby=upcoming-title] article').length`)) === 0)

// ── Tableau de bord ────────────────────────────────────────────────────────
await page.goto('/admin')
const panels = await page.eval(`return [...document.querySelectorAll('main h2')].map((h) => h.textContent)`)
for (const panel of ['Prochaines consultations', 'Statut des consultations', 'Calendrier des 7 prochains jours', 'Produits les plus consultés', 'Demandes adressées à ARIA', 'Dernières réservations', 'Commandes fictives']) {
  check(`Tableau de bord : ${panel}`, panels.includes(panel))
}
check('Tableau de bord : « Données de démonstration »', await page.eval(`return document.body.textContent.includes('Données de démonstration')`))

// ── Clavier ────────────────────────────────────────────────────────────────
await page.goto('/shop')
await page.key(KEYS.tab)
check('Clavier : 1er Tab = « Aller au contenu »', (await page.eval('return document.activeElement.textContent')) === 'Aller au contenu')
await page.viewport(390, 844)
await page.goto('/')
await page.eval(`document.querySelector('button[aria-controls=mobile-menu]').focus(); return 1`)
await page.key(KEYS.enter)
const menuOpened = await page.eval(`return Boolean(document.querySelector('#mobile-menu'))`)
await page.key(KEYS.escape)
check('Menu mobile : Entrée ouvre, Échap ferme', menuOpened && (await page.eval(`return !document.querySelector('#mobile-menu')`)))

// ── Audit responsive et accessibilité : 10 routes × 5 largeurs ─────────────
const ROUTES = ['/', '/shop', '/shop/table-calanque', '/booking', '/concierge', '/cart', '/account', '/admin', '/404', '/route-inexistante']
const AUDIT = `
  for (const img of document.querySelectorAll('img[loading=lazy]')) img.loading = 'eager'
  await new Promise((resolve) => setTimeout(resolve, 900))
  const issues = []
  const width = document.documentElement.clientWidth
  if (document.documentElement.scrollWidth > width) issues.push('défilement horizontal')
  if (document.querySelectorAll('h1').length !== 1) issues.push('nombre de h1 ≠ 1')
  if (!document.title.includes('Maison Aria')) issues.push('titre d’onglet')
  for (const img of document.images) {
    if (!img.hasAttribute('alt')) issues.push('image sans alt')
    if (img.complete && img.naturalWidth === 0) issues.push('image cassée ' + img.getAttribute('src'))
    if (img.currentSrc && !img.currentSrc.startsWith(location.origin)) issues.push('image externe')
  }
  for (const field of document.querySelectorAll('input:not([type=hidden]), select, textarea')) if (!field.labels?.length && !field.getAttribute('aria-label')) issues.push('champ sans libellé ' + field.id)
  for (const el of document.querySelectorAll('button, a[href]')) if (!el.closest('[aria-hidden=true]') && !el.textContent.trim() && !el.getAttribute('aria-label')) issues.push('élément sans nom')
  if (!document.body.textContent.includes('Projet personnel de démonstration — Maison Aria')) issues.push('mention démo absente')
  return [...new Set(issues)]`
const auditProblems = []
for (const width of [360, 390, 768, 1024, 1440]) {
  await page.viewport(width, 900)
  for (const route of ROUTES) {
    await page.goto(route)
    const issues = await page.eval(AUDIT)
    if (issues.length) auditProblems.push(`${width}px ${route} : ${issues.join(', ')}`)
  }
}
check('Audit 10 routes × 5 largeurs (débordement, h1, alt, libellés, mention démo)', auditProblems.length === 0, auditProblems.join(' | '))
check('Aucune erreur dans la console', page.errors().length === 0, page.errors().join(' | '))

await page.close()
if (server) process.kill(-server.pid)
console.log(`\n${passed} vérifications réussies, ${failed} échec(s).`)
process.exit(failed ? 1 : 0)
