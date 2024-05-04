
export enum leverState {
    completed = 0,
    activated = 1,
    desactivated = 2,
}

export type Lever = {
    lever: number,
    state: leverState
}