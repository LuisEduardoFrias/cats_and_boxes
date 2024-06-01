/***/
import Play from "./Play"
import Levels from "./Levels"
import Settings from "./Settings"
import Tutorial from "./Tutorial"
import Menu from "../components/Menu"
import WindowSound from "../components/WindowSound"
import OpenClose from "../components/OpenClose"

import { useSubscribeState } from "../subscribe_state/index"
import "../styles/screens/game.css"

export default function Game() {
    const [{ levelsView, settingView, playView, tutorialView, confetti }, _] = useSubscribeState(["levelsView", "settingView", "playView", "tutorialView", "confetti"])

    return (
        <div className="game">
            <header>
                <h1 className="game-text-logo font-effect-shadow-multiple" >
                    CATS & BOXES
                </h1>
            </header>
            <main>
                <OpenClose notInitialize={true} dependecies={[levelsView, settingView, playView, tutorialView]}>
                    {
                        (!playView && !tutorialView) &&
                        <WindowSound src="/sound/music.mp3" >
                            {(!playView && !settingView && !levelsView && !tutorialView) &&
                                <Menu />
                            }
                            {levelsView && <Levels />}
                            {settingView && <Settings />}
                        </WindowSound>
                    }
                    {playView &&
                        <WindowSound src="/sound/play.mp3" >
                            <Play />
                        </WindowSound>
                    }
                    {tutorialView &&
                        <WindowSound src="/sound/play.mp3" >
                            <Tutorial />
                        </WindowSound>
                    }

                </OpenClose>
            </main >
            {confetti && <img src={`/images/confetti.gif`} className="game-confetti" alt="image of confetti" />}
        </div>
    )

}