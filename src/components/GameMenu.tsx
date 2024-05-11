import { dispatch } from "../subscribe_state/index"
import "../styles/components/gameMenu.css"

export default function GameMenu() {
    return (
        <div className="game-menu-container">
            <button tabindex={0} className="btn menu-btn menu-play" onClick={() => dispatch({ type: "ChangeStateViewMenuGame", isShow: false })}>Restart</button>
            <button tabindex={1} className="btn menu-btn menu-play" onClick={() => dispatch({ type: "ChangeStateViewLevels", isShow: true })}>Back to levels</button>
            <button tabindex={2} className="btn menu-btn menu-play" onClick={() => dispatch({ type: "ChangeStateViewSettings", isShow: true })}>Settings</button>
        </div>)
}