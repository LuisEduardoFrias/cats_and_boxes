/***/
import { Sound } from "../models/Sound"
import { useState, ChangeEvent } from "react"

type TAudioControlProps = {
    title: string,
    icons: [string, string],
    volume: number,
    check: boolean,
    onchange: (obj: Sound) => void,
}

export default function AudioControl({ title, icons, volume, check, onchange }: TAudioControlProps) {

    const [_volume_, setVolum] = useState(volume)
    const [_check_, setCheck] = useState(check)

    function handleVolum(event: ChangeEvent<HTMLInputElement>) {
        const _volume = Number(event.target.value);

        let check_ = _check_;

        if (!_check_ && _volume === 0) {
            check_ = true;
        }
        else if (_check_) {
            check_ = false;
        }

        setCheck(check_)
        setVolum(_volume);
        onchange({ volume: _volume, muted: check_ })
    }

    function handleCheck(event: ChangeEvent<HTMLInputElement>) {
        const isCheck = Boolean(event.target.checked);

        let volume_ = _volume_;

        if (!isCheck) {
            volume_ = 40;
        }
        else {
            volume_ = 0;
        }

        setCheck(isCheck)
        setVolum(volume_);
        onchange({ volume: volume_, muted: isCheck })
    }

    return (
        <div className="sound-control">
            <label>
                {title}
                <div>
                    {_check_ && <img src={icons[0]} alt="image of sound icon" />}
                    {!_check_ && <img src={icons[1]} alt="image of sound icon" />}
                </div>
                <input tabindex={3} type="checkbox" checked={_check_} onChange={handleCheck} />
            </label>
            <input tabindex={4} type="range" value={_volume_} onChange={handleVolum} />
        </div>)
}