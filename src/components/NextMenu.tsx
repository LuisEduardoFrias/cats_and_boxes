import { dispatch } from "../subscribe_state/index"
import { levelBuildHelper } from "../helpers/levelBuilderFunctionHelper.ts"
import "../styles/components/nextmenu.css"
type TNextMenjProps = {
    level: number
}

export default function NextMenu({ level }: TNextMenuProps) {

    function handleSeletLever() {
        dispatch({ type: "InitializeGame", level: level, ...levelBuildHelper(level) })
    }

    return (
        <div className="next-menu-container">
            <button tabindex={0} className="btn menu-btn menu-play" onClick={handleSeletLever}>To next level</button>
            <button tabindex={1} className="btn menu-btn menu-play" onClick={() => dispatch({ type: "ChangeStateViewLevels", isShow: true })}>Back to levels</button>
        </div>)
}