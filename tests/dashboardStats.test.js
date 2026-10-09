import assert from 'node:assert/strict'
import { test } from 'node:test'
import { computeDashboard, topViewedProducts } from '../src/features/admin/dashboardStats.js'

const now = new Date('2026-10-08T10:00:00Z')
const booking = (id, start, status = 'confirmed', createdAt = '2026-10-01T00:00:00Z') => ({ id, start, end: start, status, createdAt })

test('indicateurs du tableau de bord', () => {
  const stats = computeDashboard([
    booking('a', '2026-10-08T07:00:00Z'),
    booking('b', '2026-10-08T14:00:00Z'),
    booking('c', '2026-10-09T08:00:00Z', 'confirmed', '2026-10-05T00:00:00Z'),
    booking('d', '2026-10-20T08:00:00Z'),
    booking('e', '2026-10-08T15:00:00Z', 'cancelled'),
  ], now)
  assert.deepEqual(stats.todayBookings.map((b) => b.id), ['a', 'b'])
  assert.equal(stats.upcomingCount7Days, 2)
  assert.deepEqual(stats.nextBookings.map((b) => b.id), ['b', 'c', 'd'])
  assert.deepEqual(stats.statusCounts, { upcoming: 3, completed: 1, cancelled: 1 })
  assert.deepEqual(stats.week.slice(0, 2).map((d) => d.count), [2, 1])
  assert.equal(stats.latest[0].id, 'c')
})

test('produits les plus consultés : fusion des vues fictives et locales', () => {
  assert.deepEqual(topViewedProducts({ x: 5, y: 3 }, { y: 4, z: 1 }, 2), [
    { productId: 'y', views: 7 },
    { productId: 'x', views: 5 },
  ])
})
