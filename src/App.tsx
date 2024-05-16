//
import levels from "./assets/jsons/levels.json"
import { levelState } from "./models/Level"
import intefaceReducer from "./reducers/interfaceReducer"
import domainReducer from "./reducers/domainReducer"
import { DomainGlobalState } from "./models/DomainGlobalState"
import { InterfaceGlobalState } from "./models/InterfaceGlobalState"
import Game from "./screens/Game"
import useInitialize from "./subscribe_state/index"
import './App.css'

const domInitialState: DomainGlobalState = {
    virtualGrid: [],
    level: null,
    movements: 0,
    gatsInBixes: [],
    tiles_position: undefined,
}

const intInitialState: InterfaceGlobalState = {
    tile_seleted: undefined,
    levels: levels.map((_, i) => ({ level: i, state: i <= 1 ? levelState.activated : levelState.desactivated })),
    edited_grids: [],
    confetti: false,
    release: true,
    menuGame: false,
    viewlevels: false,
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
