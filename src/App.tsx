//
import levers from "../public/jsons/levers.json"
import pieces from "../public/jsons/pieces.json"
import useInitialize from "./subscribe_state/index"
import reducer from "./models/reducer"
import Point from "./models/point"
import Game from "./components/Game"
import helperInsertGatsTilesPositionsInGrid from "./helpers/helper_insert_gats_tiles_positions_ingrid"
import { GlobalState } from "./models/global_state"
import './App.css'

const initialState: GlobalState = {
    edited_grids: [],
    gats_position: levers[0].gats_position,
    grid: [],//helperInsertGatsTilesPositionsInGrid(pieces),
    lever: 0,
    levers,//: levers.map(e => ({ lever: e.lever, wasLevelCompleted: e.wasLevelCompleted })),
    pieces,
    tiles_position: levers[0].tiles_position,
    tile_seleted: undefined,
    viewLevers: false,
    viewPlay: false,
    viewSetting: false
}

export default function App() {
    useInitialize(reducer, initialState);
    return (<Game />)
}
