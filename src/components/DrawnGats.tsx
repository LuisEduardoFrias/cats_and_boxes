/**/
import levels from "../assets/jsons/levels.json"
import Gat from "../models/gat"
import { selectAll } from "../models/SelectAll"
import "../styles/components/gat.css"
import { getIndexByPoint } from "../helpers/gridFunctionHelper.ts"
import { useSubscribeState } from "../subscribe_state/index"

export default function DrawnGats({ level }: number) {
    const [{ boxChangeImg, selectAll : selectAllforfilter}, _] = useSubscribeState(["boxChangeImg", "selectAll"])

    const gats_position: Gat[4] = levels[level].gats_position;

    const filter = (selectAllforfilter !== selectAll.none && selectAllforfilter !== selectAll.cats) ? "blur(10px)" : "blur(0px)";

    return (
        <>
            {gats_position?.map((gat: Gat, index: number) => <DrawGat key={index} filter={filter} boxChangeImg={boxChangeImg} index={index} gat={gat} />)}
        </>
    );
}

type TDrawGatProps = {
    gat: Gat,
    index: number,
    boxChangeImg: [],
    filter: string,
    tile_size?: 1 | 2 | 3,
}

function DrawGat({ gat, index, boxChangeImg, filter, tile_size = 1 }: TDrawGatProps) {

    const obj = boxChangeImg.find(e => e.indexBox === getIndexByPoint(gat))

    const containerStyle = {
        filter: filter,
        position: "absolute",
        bottom: `${(gat.point.y - 1) * 64}px`,
        left: `${(gat.point.x - 1) * 64}px`
    }

    const imageStyle = {
        width: `${50 * tile_size}px`,
        height: `${50 * tile_size}px`,
    }

    return (
        <div key={index} className="gat-container" style={containerStyle} >
            {!obj && <img src={`/images/${gat.name}.png`} className="gat-img" style={imageStyle} />}
        </div>
    )
}