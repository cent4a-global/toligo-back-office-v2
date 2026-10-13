import { test } from 'node:test'
import assert from 'node:assert/strict'
import { findConflictingZone } from './zoneOverlap.js'

const points = coordinates => coordinates.map(([lat, lng]) => ({ lat, lng }))
const zone = { id: 1, nom: 'Centre', polygone: points([[0, 0], [0, 2], [2, 2], [2, 0]]) }

test('allows a separate polygon', () => {
    assert.equal(findConflictingZone(points([[3, 3], [3, 4], [4, 4]]), [zone]), undefined)
})

test('rejects a point inside or on the boundary', () => {
    for (const point of [[1, 1], [0, 1], [0, 0]]) {
        assert.equal(findConflictingZone(points([point]), [zone]), zone)
    }
})

test('rejects a crossing segment with both endpoints outside', () => {
    assert.equal(findConflictingZone(points([[1, -1], [1, 3]]), [zone]), zone)
})

test('checks the automatic closing segment', () => {
    assert.equal(findConflictingZone(points([[1, -1], [3, -1], [1, 3]]), [zone]), zone)
})

test('rejects a polygon enclosing an existing zone', () => {
    assert.equal(findConflictingZone(points([[-1, -1], [-1, 3], [3, 3], [3, -1]]), [zone]), zone)
})

test('ignores the zone being edited, including string IDs', () => {
    assert.equal(findConflictingZone(zone.polygone, [zone], '1'), undefined)
})

test('ignores missing contours and checks inactive zones', () => {
    const inactive = { ...zone, est_active: false }
    assert.equal(findConflictingZone(points([[1, 1]]), [{ id: 2 }, inactive]), inactive)
})
