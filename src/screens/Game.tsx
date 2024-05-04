/***/
import Play from "./Play"
import Levers from "./Levers"
import Settings from "./Settings"

import Menu from "../components/Menu"
import OpenClose from "../components/OpenClose"

import { useSubscribeState } from "../subscribe_state/index"
import "../styles/screens/game.css"

export default function Game() {
    const [{ viewLevers, viewSetting, viewPlay }, _] = useSubscribeState(["viewLevers", "viewSetting", "viewPlay"])

    return (
        <div className="game">
            <header>
                <h1 className="game-text-logo font-effect-shadow-multiple" >
                    GATS & BOXES
                </h1>
            </header>
            <main>
                <OpenClose notInitialize={true} dependecies={[viewLevers, viewSetting, viewPlay]}>
                    {(!viewPlay && !viewSetting && !viewLevers) && <Menu />}
                    {viewPlay && <Play />}
                    {viewLevers && <Levers />}
                    {viewSetting && <Settings />}
                </OpenClose>
            </main >
        </div >
    )
}