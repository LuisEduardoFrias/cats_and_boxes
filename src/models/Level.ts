
export enum levelState {
    completed = 0,
    activated = 1,
    desactivated = 2,
}

export type Level = {
    level: number,
    state: levelState
}