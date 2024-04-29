import { dispatch } from "../subscribe_state/index"

export function handleDragStart(event) {

}

export function handleDragMove(event) {

}

export function handleDragOver(event) {
    console.log("active:" + JSON.stringify(event.active))
    console.log("over: " + JSON.stringify(event.over))
    console.log("collition: " + JSON.stringify(event.collition))

    const rotation = event.active.data.current.pieces.rotation;

    if (event.active.id === "t") {
        dispatch({
            type: "ChangeEditedGrids",
            gridIds: tPieceShadowPosition(rotation, event.over.id)
        })
    }
}

function tPieceShadowPosition(rotation: 0 | 90 | 180 | 270, id: number) {
    if (rotation === 0) return [id+1 , id + 5, id + 6, id + 7];
    else if (rotation === 90) return [id - 4, id, id + 1, id + 6];
    else if (rotation === 180) return [id, id + 1, id + 2, id + 6];
    else if (rotation === 270) return [id - 5, id + 1, id, id + 5];
}

export function handleDragEnd(event) {

    if (event.over) {
        let x = 0, y = 0;

        if (event.active.id === 't' || event.active.id === "z") {
            x = event.over.data.current.x - 1;
            y = event.over.data.current.y - 2;
        } else if (event.active.id === 'l' || event.active.id === "li") {
            x = event.over.data.current.x;
            y = event.over.data.current.y;
        }

        dispatch({ type: "Move", position: { x, y }, tile: event.active.id })
    }
}