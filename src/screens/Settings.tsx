/***/
import { dispatch } from "../subscribe_state/index"
import AudioControl from "../components/AudioControl"
import "../styles/screens/settings.css";

export default function Settings() {
    return (
        <section className="sound" >
            <div className="sound-header">
                <h2>Settings</h2>
                <button tabindex={0} className="btn" onClick={() => dispatch({ type: "ChangeStateViewSettings", isShow: false })} ><img src="images/back.png" atl="image of back arrow" /></button>
            </div>
            <form className="sound-container">
                <AudioControl title="Melody" icons={["/images/melodyless.png", "/images/melody.png"]} />
                <AudioControl title="Sound" icons={["/images/soundless.png", "/images/sound.png"]} />
            </form>
        </section>)
}