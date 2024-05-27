/**/
import levels from "../assets/jsons/levels.json"
import Gat from "../models/gat"
import "../styles/components/gat.css"
import { getIndexByPoint } from "../helpers/gridFunctionHelper.ts"
import { useSubscribeState } from "../subscribe_state/index"

export default function DrawnGats({ level }: number) {
    const [{ boxChangeImg }, _] = useSubscribeState(["boxChangeImg"])
    
    const gats_position: Gat[4] = levels[level].gats_position;

    return (
        <>
            {gats_position?.map((gat: Gat, index: number) => <DrawGat key={index} boxChangeImg={boxChangeImg} index={index} gat={gat} />)}
        </>
    );
}

type TDrawGatProps = {
    gat: Gat,
    index: number,
    boxChangeImg: [],
    tile_size?: 1 | 2 | 3,
}

function DrawGat({ gat, index, boxChangeImg, tile_size = 1 }: TDrawGatProps) {

    const obj = boxChangeImg.find(e => e.indexBox === getIndexByPoint(gat))

    const containerStyle = {
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