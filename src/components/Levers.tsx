import { useSubscribeState } from "../subscribe_state/index"
import "../styles/levers.css"

export default function Levers() {
    const [{ levers, lever }, dispatch] = useSubscribeState(["levers", "lever"])

    const index = levers.map(e => e.wasLevelCompleted).lastIndexOf(true) + 1;

    function handleSeletLever(_lever) {
        dispatch({ type: "SelectLever", lever: _lever })
    }

    const getClassName = (obj) => `${obj.wasLevelCompleted || obj.lever <= (index + 2) ? "open-box" : "close-box"} ${obj.lever === (lever + 1) ? "select-box" : ""}`

    return (
        <section className="lever" >
            <div className="lever-header">
                <h2>Levers</h2>
                <button tabindex={0} className="btn" onClick={() => dispatch({ type: "ChangeStateViewLevers", isShow: false })} ><img src="images/back.png" atl="image of back arrow" /></button>
            </div>
            <div className="lever-container">
                {
                    levers.map(e =>
                        <article key={e.lever} className={getClassName(e)} onClick={() => handleSeletLever(e.lever)} role="button" tabindex={e.lever}>
                            <span>{e.lever}</span>
                        </article>)
                }
            </div>
        </section>)
}