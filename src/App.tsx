
import levers from "../public/jsons/levers.json"
import pieces from "../public/jsons/pieces.json"
import { DndContext } from '@dnd-kit/core';
import useInitialize from "./subscribe_state/index"
import Gats from "./components/gats"
import Tiles from "./components/tiles"
import Board from "./components/board"
import { Tile } from "./models/tile"
import { Gat } from "./models/gat"
import { Piece } from "./models/piece"
import './App.css'

type GetBox = {
    lever: number;
    pieces: Piece;
    tiles_position: [Tile, Tile, Tile, Tile];
    gats_position: [Gat, Gat, Gat, Gat, Gat];
    tile_seleted: undefined
}

const initialState: GetBox = {
    lever: 0,
    pieces,
    tiles_position: levers[0].tiles_position,
    gats_position: levers[0].gats_position,
    tile_seleted: undefined,
}

type Action =
    { type: "ChangeRotation", rotation: 0 | 90 | 180 | 270, tile_name: string } |
    { type: "SeletTile", tile: string | undefined };

function reducer(state: GetBox, actions: Action) {
    const _actions = {
        ChangeRotation: () => {
            const tiles_position = { ...state.tiles_position };
            tiles_position[actions.tile_name].rotation = actions.rotation;
            return { ...state, tiles_position }
        },
        SeletTile: () => {
            return { ...state, tile_seleted: actions.tile }
        }
    };

    return _actions[actions.type]();
}

export default function App() {
    useInitialize(reducer, initialState);

    return (
        <>
            <h1>Gatos y Cajas</h1>
            <DndContext onDragEnd={handleDragEnd}>
                <div className="contenedor">
                    <Board>
                        <Tiles />
                        <Gats />
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
