/***/
import Play from "./Play"
import Levels from "./Levels"
import Settings from "./Settings"
import Menu from "../components/Menu"
import OpenClose from "../components/OpenClose"

import { useSubscribeState } from "../subscribe_state/index"
import "../styles/screens/game.css"

export default function Game() {
    const [{ viewLevels, viewSetting, viewPlay, confetti }, _] = useSubscribeState(["viewLevels", "viewSetting", "viewPlay", "confetti"])

    return (
        <div className="game">
            <header>
                <h1 className="game-text-logo font-effect-shadow-multiple" >
                    GATS & BOXES
                </h1>
            </header>
            <main>
                <OpenClose notInitialize={true} dependecies={[viewLevels, viewSetting, viewPlay]}>
                    {(!viewPlay && !viewSetting && !viewLevels) && <Menu />}
                    {viewPlay && <Play />}
                    {viewLevels && <Levels />}
                    {viewSetting && <Settings />}
                </OpenClose>
            </main >
            {confetti && <img src={`/images/confetti.gif`} className="game-confetti" alt="image of confetti" />}
        </div >
    )

}