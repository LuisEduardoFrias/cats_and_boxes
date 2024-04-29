import { dispatch } from "../subscribe_state/index"
import "../styles/menu.css"

export default function Menu() {
    return (
        <section className="menu">
            <button tabindex={0} className="btn menu-btn menu-play" onClick={() => dispatch({ type: "ChangeStateViewLevers", isShow: true })}>Play</button>
            <button tabindex={1} className="btn menu-btn menu-settings" onClick={() => dispatch({ type: "ChangeStateViewSettings", isShow: true })} >Settings</button>
        </section>
    )
}