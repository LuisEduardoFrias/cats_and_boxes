
type Size = {
    width: number,
    height: number
};

type Rotation = 0 | 90 | 180 | 270;

type Mosaic = {
    img: string,
    x: number,
    y: number
}

type Tesserae = {
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
    pieces: Tesserae[]
}