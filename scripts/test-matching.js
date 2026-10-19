// Quick tests for src/lib/matching.js
// Run from the project root:  node scripts/test-matching.js

import { pearson, matchPercent, rankOccupations } from '../src/lib/matching.js'
import data from '../src/data/occupations.json' with { type: 'json' }

let passed = 0
let failed = 0

function check(name, actual, expected){
    // Numbers: allow tiny floating-point differences
    const ok = typeof expected === 'number'
        ? Math.abs(actual - expected) < 0.001
        : actual === expected
    if(ok){
        passed++
        console.log(`  ✅ ${name}`)
    } else {
        failed++
        console.log(`  ❌ ${name}\n     expected: ${expected}\n     actual:   ${actual}`)
    }
}

const me = { R: 20, I: 9, A: 14, S: 20, E: 16, C: 18 }
const foodServers = { R: 4.84, I: 1.46, A: 2.1, S: 4.23, E: 2.85, C: 3.87 }
const politicalSci = { R: 1, I: 6.71, A: 3.87, S: 3.42, E: 3.61, C: 3.52 }
const allSame = { R: 3, I: 3, A: 3, S: 3, E: 3, C: 3 }

console.log('\npearson')
check('typical: Food Servers ≈ 0.957', pearson(me, foodServers), 0.9567)
check('typical: Political Scientists ≈ -0.880', pearson(me, politicalSci), -0.8797)
check('extreme: identical profile = 1', pearson(me, me), 1)
const opposite = { R: -20, I: -9, A: -14, S: -20, E: -16, C: -18 }
check('extreme: opposite profile = -1', pearson(me, opposite), -1)
check('edge: all scores equal = 0 (not NaN)', pearson(me, allSame), 0)
check('property: swapping arguments gives the same r', pearson(foodServers, me), pearson(me, foodServers))
const doubled = { R: 40, I: 18, A: 28, S: 40, E: 32, C: 36 }
check('property: doubling scores gives the same r', pearson(doubled, foodServers), pearson(me, foodServers))

console.log('\nmatchPercent')
check('typical: Food Servers = 98', matchPercent(me, foodServers), 98)
check('typical: Political Scientists = 6', matchPercent(me, politicalSci), 6)
check('edge: r = 0 → 50', matchPercent(me, allSame), 50)
check('extreme: r = 1 → 100', matchPercent(me, me), 100)
check('extreme: r = -1 → 0', matchPercent(me, opposite), 0)
check('returns an integer', Number.isInteger(matchPercent(me, foodServers)), true)

console.log('\nrankOccupations (3 sample occupations)')
const small = [
    { code: 'A', riasec: politicalSci },
    { code: 'B', riasec: foodServers },
    { code: 'C', riasec: allSame },
]
const rankedSmall = rankOccupations(me, small)
check('order: B, C, A', rankedSmall.map(o => o.code).join(', '), 'B, C, A')
check('every item has a match', rankedSmall.every(o => typeof o.match === 'number'), true)
check('keeps original fields (riasec)', rankedSmall[0].riasec, foodServers)
check('side effect: original array order unchanged', small.map(o => o.code).join(', '), 'A, B, C')
check('side effect: original objects have no match field', 'match' in small[0], false)

console.log('\nrankOccupations (923 real occupations)')
const ranked = rankOccupations(me, data.occupations)
check('count = 923', ranked.length, 923)
check('#1: Food Servers, Nonrestaurant', ranked[0].title, 'Food Servers, Nonrestaurant')
check('#1 match = 98', ranked[0].match, 98)
check('#2: Funeral Attendants 97', `${ranked[1].title} ${ranked[1].match}`, 'Funeral Attendants 97')
check('last: Political Scientists 6', `${ranked.at(-1).title} ${ranked.at(-1).match}`, 'Political Scientists 6')
check('sorted from highest to lowest', ranked.every((o, i) => i === 0 || ranked[i - 1].match >= o.match), true)
check('no NaN', ranked.some(o => Number.isNaN(o.match)), false)

console.log(`\n${passed} passed, ${failed} failed\n`)