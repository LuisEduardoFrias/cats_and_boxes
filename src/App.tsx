//
import levers from "./assets/jsons/levers.json"
import {leverState} from "./models/Lever"
import intefaceReducer from "./reducers/interfaceReducer"
import domainReducer from "./reducers/domainReducer"
import { DomainGlobalState } from "./models/DomainGlobalState"
import { InterfaceGlobalState } from "./models/InterfaceGlobalState"
import Game from "./screens/Game"
import useInitialize from "./subscribe_state/index"
import './App.css'

const domInitialState: DomainGlobalState = {
    grid: [],
    lever: 0,
    tiles_position: undefined,
}

const intInitialState: InterfaceGlobalState = {
    tile_seleted: undefined,
    levers: levers.map((_, i) => ({ lever: i, state: i <= 1 ? leverState.activated : leverState.desactivated })),
    edited_grids: [],
    viewLevers: false,
    viewPlay: false,
    viewSetting: false
}

const initialState: DomainGlobalState & InterfaceGlobalState = {
    ...intInitialState,
    ...domInitialState,
}

function reducer(state: DomainGlobalState & InterfaceGlobalState, actions: any) {
    let result = domainReducer(state, actions)

    if (!result)
        result = intefaceReducer(state, actions)

    if (!result)
        alert(`the action ${actions.type} isn't valid.`)
    else
        return result;
}

export default function App() {
    useInitialize(reducer, initialState);
    return (<Game />)
}
