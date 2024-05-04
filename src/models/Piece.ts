import { Rotation } from './Rotation'

export type Size = {
    width: number,
    height: number
};

export type Mosaic = {
    img: string,
    x: number,
    y: number
}

export type Tesserae = {
    rotation: Rotation,
    tiles: Mosaic[]
}

export type Piece = {
    name: string
    size: {
        horizontal: Size,
        vertical: Size
    },
    rotation: Rotation,
    tiles: Tesserae[]
}