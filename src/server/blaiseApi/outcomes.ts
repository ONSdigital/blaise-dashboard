const notCompletedOutcomes: number[] = [
    0,
    210,
    300,
    310
];

export function isCompleted(outcome: number): boolean {
    return !isNotCompleted(outcome);
}

export function isNotCompleted(outcome: number): boolean {
    return notCompletedOutcomes.includes(outcome);
}