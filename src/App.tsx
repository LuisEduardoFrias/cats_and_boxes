import levers from "../public/jsons/levers.json"
import { DndContext } from '@dnd-kit/core';
import Gats from "./components/gats"
import Tiles from "./components/tiles"
import Board from "./components/board"
import './App.css'

export default function App() {
    return (
        <>
            <h1>Gatos y Cajas</h1>
            <DndContext onDragEnd={handleDragEnd}>
                <div className="contenedor">
                    <Board>
                        <Tiles tilesPositions={levers[0].tiles_position} />
                        <Gats gats={levers[0].gats_position} />
                    </Board>
                </div>
            </DndContext>
        </>
    )

    function handleDragEnd(event) {
        if (event.over && event.over.id === 'droppable') {
            setIsDropped(true);
        }
    }
}
