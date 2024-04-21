import Gat from "../models/gat"
import { useSubscribeState } from "../subscribe_state/index";

export default function Gats() {
    const [{ gats_position }, _] = useSubscribeState(["gats_position"])

    return (
        <>
            {gats_position.map((gat: Gat, index: number) => <DrawGat index={index} gat={gat} />)}
        </>
    );
}

interface IDrawGatProps {
    gat: Gat,
    index: number
}

function DrawGat({ gat, index }: IDrawGatProps) {

    const _style = {
        position: "absolute",
        bottom: `${(gat.point.y - 1) * 64}px`,
        left: `${(gat.point.x - 1) * 64}px`
    }

    return (<div key={index} className="piece-gat" style={_style} >
        <img src={`/images/${gat.name}.png`} className="img" />
    </div>)
}