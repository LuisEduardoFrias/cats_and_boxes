/**/
import levels from "../assets/jsons/levels.json"
import Gat from "../models/gat"
import "../styles/components/gat.css"

export default function DrawnGats({ level }:number) {
    const gats_position: Gat[4] = levels[level].gats_position;

    return (
        <>
            {gats_position?.map((gat: Gat, index: number) => <DrawGat key={index} index={index} gat={gat} />)}
        </>
    );
}

type TDrawGatProps = {
    gat: Gat,
    index: number,
    tile_size?: 1 | 2 | 3,
}

function DrawGat({ gat, index, tile_size = 1 }: TDrawGatProps) {

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
            <img src={`/images/${gat.name}.png`} className="gat-img" style={imageStyle} />
        </div>
    )
}