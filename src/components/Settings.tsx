import React, { useState, useEffect } from "react"
import { dispatch } from "../subscribe_state/index"
import "../styles/settings.css";

export default function Settings() {
    return (
        <section className="sound" >
            <div className="sound-header">
                <h2>Settings</h2>
                <button tabindex={0} className="btn" onClick={() => dispatch({ type: "ChangeStateViewSettings", isShow: false })} ><img src="images/back.png" atl="image of back arrow" /></button>
            </div>
            <form className="sound-container">
                <Control title="Melody" icons={["/images/melodyless.png", "/images/melody.png"]} />
                <Control title="Sound" icons={["/images/soundless.png", "/images/sound.png"]} />
            </form>
        </section>)
}

type TControlProps = {
    title: string,
    icons: [string, string]
}

function Control({ title, icons }: TControlProps) {
    const [volum, setVolum] = useState(40)
    const [check, setCheck] = useState(true)

    function handleVolum(event: ChangeEvent<HTMLInputElement>) {
        const _volum = Number(event.target.value);

        if (check && _volum === 0) {
            setCheck(false);
        }
        else if (!check) {
            setCheck(true);
        }

        setVolum(_volum);
    }

    function handleCheck(event: ChangeEvent<HTMLInputElement>) {
        const isCheck = Boolean(event.target.checked);

        if (isCheck) {
            setVolum(40)
        }
        else {
            setVolum(0)
        }

        setCheck(isCheck)
    }

    return (
        <div className="sound-control">
            <label>
                {title}
                <div>
                    {!check && <img src={icons[0]} alt="image of sound icon" />}
                    {check && <img src={icons[1]} alt="image of sound icon" />}
                </div>
                <input tabindex={3} type="checkbox" checked={check} onChange={handleCheck} />
            </label>
            <input tabindex={4} type="range" value={volum} onChange={handleVolum} />
        </div>)
}