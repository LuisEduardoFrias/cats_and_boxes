import { dispatch } from "../subscribe_state/index"

export function handleDragStart(event) {
    //console.log("start: " + JSON.stringify(event))
}

export function handleDragMove(event) {
    //console.log("move - active:" + JSON.stringify(event.active, null, 0))
    // console.log("move - over: " + JSON.stringify(event.over.id, null, 0))

    //move - active:{"id":"t","data":{"current":{"pieces":{"rotation":180,"tiles":[{"img":"azulejo","x":0,"y":1},{"img":"azulejo","x":1,"y":0},{"img":"azulejo","x":2,"y":1},{"img":"box3","x":1,"y":1}]},"width":198,"height":132}},"rect":{"current":{"initial":{"top":334.3660888671875,"left":302,"width":64,"height":64,"bottom":398.3660888671875,"right":366},"translated":{"top":127.6617431640625,"left":346.5449523925781,"width":64,"height":64,"bottom":191.6617431640625,"right":410.5449523925781}}}}
    //move - over: {"id":4,"rect":{"width":64,"height":64,"top":334.3660888671875,"bottom":398.3660888671875,"right":366,"left":302},"data":{"current":{"x":5,"y":5}},"disabled":false}

    if (event.active.id === "t") {
        const rotation = event.active.data.current.pieces.rotation;

        if (rotation === 0) {
            // event.over.id < 5 
        }
        else {

        }
    }
}

export function handleDragOver(event) {
    //console.log("over - active:" + JSON.stringify(event.active, null, 0))
    //console.log("over - over: " + JSON.stringify(event.over, null, 0))
    //console.log("over - collition: " + JSON.stringify(event.collition, null, 0))

    const rotation = event.active.data.current.pieces.rotation;

    dispatch({
        type: "ChangeEditedGrids",
        gridIds: pieceShadowPosition(rotation, event.active.id, event.over.id)
    })
}

function pieceShadowPosition(rotation: 0 | 90 | 180 | 270, tileName: string, id: number) {
    if (tileName === "t") {
        if (rotation === 0) return [id - 5, id - 1, id, id + 1];
        else if (rotation === 90) return [id - 5, id - 1, id, id + 5];
        else if (rotation === 180) return [id - 1, id, id + 1, id + 5];
        else if (rotation === 270) return [id - 10, id - 5, id - 4, id];
    }
    else if (tileName === "l") {
        if (rotation === 0) return [id - 10, id - 5, id, id + 1];
        else if (rotation === 90) return [id, id - 1, id - 2, id - 5];
        else if (rotation === 180) return [id - 1, id, id + 5, id + 10];
        else if (rotation === 270) return [id, id + 1, id + 2, id + 5];
    }
    else if (tileName === "j") {
        if (rotation === 0) return [id - 5, id, id + 4, id + 5];
        else if (rotation === 90) return [id - 1, id, id + 1, id + 6];
        else if (rotation === 180) return [id - 5, id - 4, id, id + 5];
        else if (rotation === 270) return [id - 6, id - 1, id, id + 1];
    }
    else if (tileName === "z") {
        if (rotation === 0) return [id - 7, id - 6, id - 1, id, id + 4];
        else if (rotation === 90) return [id, id + 4, id + 5, id + 6, id + 9];
        else if (rotation === 180) return [id - 4, id, id + 1, id + 6, id + 7];
        else if (rotation === 270) return [id, id + 3, id + 4, id + 5, id + 9];
    }
}

export function handleDragEnd(event) {

    if (event.over) {
        let x = 0, y = 0;

        // console.log("end - active:" + JSON.stringify(event.active, null, 0))
        //console.log("end - over: " + JSON.stringify(event.over, null, 0))
        // console.log("ebd - collition: " + JSON.stringify(event.collition, null, 0))

        const rotation = event.active.data.current.pieces.rotation;
        const id = event.active.id;

        if (id === 't') {
            if (rotation === 0) {
                x = event.over.data.current.x - 2;
                y = event.over.data.current.y - 1;
            }
            if (rotation === 90) {
                x = event.over.data.current.x - 2;
                y = event.over.data.current.y - 2;
            }
            if (rotation === 180) {
                x = event.over.data.current.x - 2;
                y = event.over.data.current.y - 2;
            }
            if (rotation === 270) {
                x = event.over.data.current.x - 1;
                y = event.over.data.current.y - 1;
            }
        }
        else if (event.active.id === 'l') {
            if (rotation === 0) {
                x = event.over.data.current.x - 1;
                y = event.over.data.current.y - 1;
            }
            if (rotation === 90) {
                x = event.over.data.current.x - 3;
                y = event.over.data.current.y - 1;
            }
            if (rotation === 180) {
                x = event.over.data.current.x - 2;
                y = event.over.data.current.y - 3;
            }
            if (rotation === 270) {
                x = event.over.data.current.x - 1;
                y = event.over.data.current.y - 2;
            }
        }
        else if (event.active.id === 'j') {
            if (rotation === 0) {
                x = event.over.data.current.x - 2;
                y = event.over.data.current.y - 2;
            }
            if (rotation === 90) {
                x = event.over.data.current.x - 2;
                y = event.over.data.current.y - 2;
            }
            if (rotation === 180) {
                x = event.over.data.current.x - 1;
                y = event.over.data.current.y - 2;
            }
            if (rotation === 270) {
                x = event.over.data.current.x - 2;
                y = event.over.data.current.y - 1;
            }
        }
        else if (event.active.id === 'z') {
            if (rotation === 0) {
                x = event.over.data.current.x - 3;
                y = event.over.data.current.y - 2;
            }
            if (rotation === 90) {
                x = event.over.data.current.x - 2;
                y = event.over.data.current.y - 3;
            }
            if (rotation === 180) {
                x = event.over.data.current.x - 1;
                y = event.over.data.current.y - 2;
            }
            if (rotation === 270) {
                x = event.over.data.current.x - 3;
                y = event.over.data.current.y - 3;
            }
        }

        dispatch({ type: "Move", position: { x, y }, tile: event.active.id })
    }
}