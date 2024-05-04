/***/
import { useSubscribeState } from "../subscribe_state/index"
import { Lever, leverState } from "../models/Lever"
import "../styles/screens/levers.css"

export default function Levers() {
    const [{ lever, levers }, dispatch] = useSubscribeState(["lever", "levers"])

    function handleSeletLever(_lever: number) {
        dispatch({ type: "SelectLever", lever: _lever })
    }

    function getClassName(obj: Lever) {
        return `${obj.state === leverState.desactivated ? "close-box" : "open-box"} ${obj.lever === lever ? "select-box" : ""}`
    }

    return (
        <section className="lever" >
            <div className="lever-header">
                <h2>Levers</h2>
                <button tabindex={0} className="btn" onClick={() => dispatch({ type: "ChangeStateViewLevers", isShow: false })} ><img src="images/back.png" atl="image of back arrow" /></button>
            </div>
            <div className="lever-content">
                <div className="lever-container">
                    {
                        levers.map((e: Lever) =>
                            <article key={e.lever} className={getClassName(e)} onClick={() => { if (e.state !== leverState.desactivated) { handleSeletLever(e.lever) } }} role="button" tabindex={e.lever}>
                                <span>{e.lever + 1}</span>
                            </article>)
                    }
                </div>
            </div>
        </section>)

}