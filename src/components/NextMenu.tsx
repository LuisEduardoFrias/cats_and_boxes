import { dispatch } from "../subscribe_state/index"
import { levelBuildHelper } from "../helpers/levelBuilderFunctionHelper.ts"
import Sound from "../components/Sound"
import "../styles/components/nextmenu.css"

type TNextMenjProps = {
    level: number
}

export default function NextMenu({ level }: TNextMenuProps) {

    function handleSeletLever() {
        dispatch({ type: "InitializeGame", level: level, ...levelBuildHelper(level) })
    }

    return (
        <Sound className="next-menu-container" src={"/sound/next_lever.mp3"}>
            <div className="next-menu-content">
                <button tabindex={0} className="btn menu-btn menu-play" onClick={handleSeletLever}>To next level</button>
                <button tabindex={1} className="btn menu-btn menu-play" onClick={() => dispatch({ type: "GoToLevelsView" })}>Back to levels</button>
            </div>
        </Sound>
    )
}