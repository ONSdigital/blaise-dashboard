const completedOutcomes: number[] = [
    110,
    120,
    360,
    370,
    371,
    372,
    373,
    380,
    390,
    411,
    412,
    413,
    430,
    440,
    460,
    461,
    510,
    540,
    541,
    542,
    542,
    551,
    560,
    561,
    562,
    580,
    631,
    640,
    791,
    792,
    793,
    794,
    795
];

const notCompletedOutcomes: number[] = [
    0,
    210,
    300,
    310
];

export function isCompleted(outcome: number): boolean {
    return completedOutcomes.includes(outcome);
}

export function isNotCompleted(outcome: number): boolean {
    return notCompletedOutcomes.includes(outcome);
}