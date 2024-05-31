import { dispatch } from "../subscribe_state/index"
import "../styles/components/menu.css"

export default function Menu() {
    return (
        <section className="menu">
            <button tabindex={0} className="btn menu-btn menu-play" onClick={() => dispatch({ type: "GoToLevelsView" })}>Play</button>
            <button tabindex={0} className="btn menu-btn menu-tutorial" onClick={() => dispatch({ type: "GoToTutorialView", isShow: true })}>Tutorial</button>
            <button tabindex={1} className="btn menu-btn menu-settings" onClick={() => dispatch({ type: "GoToSettingsView" })} >Settings</button>
        </section>
    )
}