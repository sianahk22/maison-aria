import assert from 'node:assert/strict'
import { existsSync, readdirSync } from 'node:fs'
import { test } from 'node:test'
import { productImages, sceneImages } from '../src/data/images.js'
import { products } from '../src/data/products.js'

const onDisk = (publicPath) => existsSync(new URL(`../public${publicPath}`, import.meta.url))
const allImages = [...Object.values(sceneImages), ...Object.values(productImages)]

test('chaque image déclarée existe dans public/images, en toutes ses largeurs', () => {
  for (const image of allImages) {
    for (const width of image.widths) assert.ok(onDisk(`${image.file}-${width}.webp`), `${image.file}-${width}.webp`)
    if (image.detail) assert.ok(onDisk(image.detail), image.detail)
  }
  assert.ok(onDisk('/images/placeholder.svg'), 'image de secours')
})

test('chaque produit a une image avec un texte alternatif descriptif', () => {
  for (const product of products) {
    assert.ok(product.image, product.id)
    assert.ok(product.image.alt.length >= 15, `alt trop court : ${product.id}`)
  }
})

test('aucun fichier image orphelin (non référencé)', () => {
  const referenced = new Set(allImages.flatMap((image) => [...image.widths.map((w) => `${image.file}-${w}.webp`), image.detail].filter(Boolean)))
  for (const folder of ['products', 'scenes']) {
    for (const file of readdirSync(new URL(`../public/images/${folder}`, import.meta.url))) {
      assert.ok(referenced.has(`/images/${folder}/${file}`), `orphelin : ${folder}/${file}`)
    }
  }
})
