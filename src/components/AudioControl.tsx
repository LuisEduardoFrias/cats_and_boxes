/***/
import { useState, useEffect, ChangeEvent } from "react"

type TAudioControlProps = {
    title: string,
    icons: [string, string]
}

export default function AudioControl({ title, icons }: TAudioControlProps) {
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