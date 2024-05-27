/***/
import { useSubscribeState, dispatch } from "../subscribe_state/index"
import AudioControl from "../components/AudioControl"
import { Sound } from "../models/Sound"
import "../styles/screens/settings.css";

export default function Settings() {
    const [{ sound, music }, _] = useSubscribeState(["sound", "music"])

        console.log("state: " + JSON.stringify(music))

    function handleChangeMelody(obj: Sound) {
        console.log("change: " + JSON.stringify(obj))
        dispatch({ type: "ChangeMusic", music: obj })
    }

    function handleChangeSound(obj: Sound) {
        //dispatch({ type: "ChangeSound", sound: obj })
    }

    return (
        <section className="sound" >
            <div className="sound-header">
                <h2>Settings</h2>
                <button tabindex={0} className="btn" onClick={() => dispatch({ type: "GoToHome" })} >
                    <img src="images/back.png" atl="image of back arrow" />
                </button>
            </div>
            <form className="sound-container">
                <AudioControl title="Melody" onchange={handleChangeMelody} volume={music.volume} check={music.muted} icons={["/images/melodyless.png", "/images/melody.png"]} />
                <AudioControl title="Sound" onchange={handleChangeSound} volume={sound.volume} check={sound.muted} icons={["/images/soundless.png", "/images/sound.png"]} />
            </form>
        </section>
    )
}