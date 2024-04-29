//
import levers from "../public/jsons/levers.json"
import pieces from "../public/jsons/pieces.json"
import useInitialize from "./subscribe_state/index"
import reducer from "./models/reducer"
import Game from "./components/Game"
import { GlobalState } from "./models/global_state"
import './App.css'

const initialState: GlobalState = {
    viewLevers: false,
    viewSetting: false,
    viewPlay: false,
    lever: 0,
    levers,//: levers.map(e => ({ lever: e.lever, wasLevelCompleted: e.wasLevelCompleted })),
    pieces,
    tiles_position: levers[0].tiles_position,
    gats_position: levers[0].gats_position,
    tile_seleted: undefined,
    edited_grids: []
}

export default function App() {
    useInitialize(reducer, initialState);
    return (<Game />)
}
