import { dispatch } from "../subscribe_state/index"
import "../styles/components/gameMenu.css"

export default function GameMenu() {
    return (
        <div className="game-menu-container">
            <button tabindex={0} className="btn menu-btn menu-play" onClick={() => dispatch({ type: "ShowMenuOfGame", isShow: false })}>Restart</button>
            <button tabindex={1} className="btn menu-btn menu-play" onClick={() => dispatch({ type: "GameReset"})}>Reset</button>
            <button tabindex={2} className="btn menu-btn menu-play" onClick={() => dispatch({ type: "GoToLevelsView" })}>Back to levels</button>
            <button tabindex={3} className="btn menu-btn menu-play" onClick={() => dispatch({ type: "GoToSettingsView" })}>Settings</button>
        </div>)
}