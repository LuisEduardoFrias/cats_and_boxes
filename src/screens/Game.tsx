/***/
import Play from "./Play"
import Levels from "./Levels"
import Settings from "./Settings"
import Menu from "../components/Menu"
import WindowSound from "../components/WindowSound"
import OpenClose from "../components/OpenClose"

import { useSubscribeState } from "../subscribe_state/index"
import "../styles/screens/game.css"

export default function Game() {
    const [{ levelsView, settingView, playView, confetti }, _] = useSubscribeState(["levelsView", "settingView", "playView", "confetti"])

    return (
        <div className="game">
            <header>
                <h1 className="game-text-logo font-effect-shadow-multiple" >
                    GATS & BOXES
                </h1>
            </header>
            <main>
                <OpenClose notInitialize={true} dependecies={[levelsView, settingView, playView]}>
                    {(!playView && !settingView && !levelsView) &&
                        <WindowSound src="/sound/music.mp3" >
                            <Menu />
                        </WindowSound>
                    }
                    {playView &&
                        <WindowSound src="/sound/play.mp3" >
                            <Play />
                        </WindowSound>
                    }
                    {levelsView &&
                        <WindowSound src="/sound/music.mp3" >
                            <Levels />
                        </WindowSound>
                    }
                    {settingView && <Settings />}
                </OpenClose>
            </main >
            {confetti && <img src={`/images/confetti.gif`} className="game-confetti" alt="image of confetti" />}
        </div>
    )

}