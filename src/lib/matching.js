// Matches a user's RIASEC scores to an occupation's RIASEC profile.
// Uses Pearson correlation: compares the *shape* of two profiles
// Method follows O*NET Mini-IP profile correlation (Gregory & Lewis, 2016).
// Match % = (r + 1) / 2 * 100 is PathFinder's own conversion.

const AREAS = ['R','I','A','S','E','C']

function mean(scores){
    let sum = 0
    for(const area of AREAS){
        sum += scores[area]
    }
    return sum / AREAS.length
}

export function pearson(a,b){
    const meanA = mean(a)
    const meanB = mean(b)

    let numerator = 0
    let sumSqA = 0
    let sumSqB = 0

    for(const area of AREAS){
        const devA = a[area] - meanA
        const devB = b[area] - meanB

        numerator += devA * devB
        sumSqA += devA ** 2
        sumSqB += devB ** 2
    }

    const denominator = Math.sqrt(sumSqA * sumSqB)

    if(denominator === 0){
        return 0
    }
    return numerator / denominator
}

export function matchPercent(userScores, occupationRiasec){
    const r = pearson(userScores, occupationRiasec)
    return Math.round((r + 1) / 2 * 100)
}

