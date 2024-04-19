
interface IGatProps {
    gats: object[]
}

export default function Gats({ gats }: IGatProps) {
    function Draw({ gat, key }) {

        const _left = (gat.point.x - 1) * 64;
        const _bottom = (gat.point.y - 1) * 64;

        const _style = {
            position: "absolute",
            bottom: `${_bottom}px`,
            left: `${_left}px`
        }

        return (
            <div key={key} className="piece-gat" style={_style} >
                <img src={`/images/${gat.name}.png`} className="img" />
            </div>)
    }

    return (
        <>
            {gats.map((e, i) => <Draw key={i} gat={e} />)}
        </>
    );
}