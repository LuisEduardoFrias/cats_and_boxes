import { useDroppable } from '@dnd-kit/core';
import { children } from "react"
import { useSubscribeState } from "../subscribe_state/index"
import "../styles/board.css"

type TBoardProps = {
    children: Children,
    tile_size?: 1 | 2 | 3,
}

export default function Board({ children, tile_size = 1 }: TBoardProps) {

    const [{ edited_grids }] = useSubscribeState(["edited_grids"])

    if (tile_size < 1 || tile_size > 3) {
        tile_size = 1;
    }

    const size = 64;
    const array = new Array(25).fill(undefined);

    const board_style = {
        width: `${(size * tile_size) * 5}px`,
        height: `${(size * tile_size) * 5}px`,
        gridTemplateColumns: `repeat(5, ${size * tile_size}px)`,
        gridTemplateRows: `repeat(5, ${size * tile_size}px)`
    }

    return (
        <div className="board" style={board_style} >
            {array.map((_, index) => <Droppable key={index} id={index} is_back={checkGrid(index, edited_grids)} size={size} tile_size={tile_size} />)}
            {children}
        </div>
    )
}

function checkGrid(index: number, edited_grids: number[]): boolean {
    return edited_grids.find(e => e === index) === undefined ? false : true;
}

type TDroppable = {
    id: number,
    size: number,
    tile_size: 1 | 2 | 3,
    is_back: boolean
}

function Droppable({ id, size, is_back, tile_size }: TDroppable) {

    const { rect, node, over, isOver, setNodeRef } = useDroppable({
        id, data: {
            x: id < 5 ? id + 1 :
                id < 10 ? id - 4 :
                    id < 15 ? id - 9 :
                        id < 20 ? id - 14 :
                            id < 25 ? id - 19 : 0,
            y: id < 5 ? 5 :
                id < 10 ? 4 :
                    id < 15 ? 3 :
                        id < 20 ? 2 :
                            id < 25 ? 1 : 0,
        }
    });

    const style = {
        width: `${size * tile_size}px`,
        height: `${size * tile_size}px`,
        backgroundColor: is_back ? 'black' : "",
       // backgroundColor: isOver ? 'yellow' : "",
    };

    return (
        <div key={id} ref={setNodeRef} className="tile" style={style} >
        </div>
    );
}