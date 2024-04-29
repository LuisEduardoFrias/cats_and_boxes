//
import { DndContext, closestCenter } from '@dnd-kit/core';
import Gats from "./gats"
import Tiles from "./tiles"
import Board from "./board"
import { handleDragStart, handleDragMove, handleDragOver, handleDragEnd, } from "../helpers/helper_game"

export default function Play() {
    return (
        <div className="game-container">
            <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <Board tile_size={1} >
                    {/* 
                    <Tiles /> 
                    */}
                    <Gats />
                </Board>
            </DndContext>
        </div>
    )
}