import { useDroppable } from '@dnd-kit/core';
import { Children } from "react"
import { selectAll } from "../models/SelectAll"
import { useSubscribeState } from "../subscribe_state/index"
import "../styles/components/board.css"

type TBoardProps = {
    children: Children,
    tile_size?: 1 | 2 | 3,
}

export default function DrawnBoard({ children, tile_size = 1 }: TBoardProps) {

    const [{ shadow_in_grid, selectAll: selectAllforfilter }] = useSubscribeState(["shadow_in_grid", "selectAll"])
    
    if (tile_size < 1 || tile_size > 3) {
        tile_size = 1;
    }

    const size = 64;
    const grid = new Array(25).fill(null);

    const board_style = {
        width: `${(size * tile_size) * 5}px`,
        height: `${(size * tile_size) * 5}px`,
        gridTemplateColumns: `repeat(5, ${size * tile_size}px)`,
        gridTemplateRows: `repeat(5, ${size * tile_size}px)`
    }

    const filter = selectAllforfilter !== selectAll.none ? "blur(10px)" : "blur(0px)";

    return (
        <div className="board" style={board_style} >
            {grid.map((_, index) => <Droppable key={index} filter={filter} id={index} is_back={checkGrid(index, shadow_in_grid)} size={size} tile_size={tile_size} />)}
            {children}
        </div>
    )
}

function checkGrid(index: number, shadow_in_grid: number[]): boolean {
    return shadow_in_grid?.find(e => e === index) === undefined ? false : true;
}

type TDroppable = {
    id: number,
    size: number,
    tile_size: 1 | 2 | 3,
    is_back: boolean,
    filter: string,
}

function Droppable({ id, size, tile_size, is_back, filter }: TDroppable) {

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
        filter: filter,
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