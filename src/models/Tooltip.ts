import { Point } from "./Point"

export enum arrow {
    top_left,
    top_right,
    none,
    bottom_left,
    bottom_right,
}

export type Tooltip = {
    message: string,
    point: Point,
    arrow: arrow,
    fn: () => void | null,
    exit?: boolean
}