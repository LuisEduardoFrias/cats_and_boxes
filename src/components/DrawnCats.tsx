/**/
import levels from "../assets/jsons/levels.json"
import { Cat } from "../models/Cat"
import { selectAll } from "../models/SelectAll"
import "../styles/components/cat.css"
import { getIndexByPoint } from "../helpers/gridFunctionHelper.ts"
import { useSubscribeState } from "../subscribe_state/index"

export default function DrawnCats({ level }: number) {
    const [{ boxChangeImg, selectAll: selectAllforfilter }, _] = useSubscribeState(["boxChangeImg", "selectAll"])

    const cats_position: Cat[4] = levels[level].cats_position;

    const filter = (selectAllforfilter !== selectAll.none && selectAllforfilter !== selectAll.cats) ? "blur(10px)" : "blur(0px)";

    return (
        <>
            {cats_position?.map((cat: Cat, index: number) => <DrawCat key={index} filter={filter} boxChangeImg={boxChangeImg} index={index} cat={cat} />)}
        </>
    );
}

type TDrawCatProps = {
    cat: Cat,
    index: number,
    boxChangeImg: [],
    filter: string,
    tile_size?: 1 | 2 | 3,
}

function DrawCat({ cat, index, boxChangeImg, filter, tile_size = 1 }: TDrawCatProps) {

    const obj = boxChangeImg.find(e => e.indexBox === getIndexByPoint(cat))

    const containerStyle = {
        filter: filter,
        position: "absolute",
        bottom: `${(cat.point.y - 1) * 64}px`,
        left: `${(cat.point.x - 1) * 64}px`
    }

    const imageStyle = {
        width: `${50 * tile_size}px`,
        height: `${50 * tile_size}px`,
    }

    return (
        <div key={index} className="cat-container" style={containerStyle} >
            {!obj && <img src={`/images/${cat.name}.png`} className="cat-img" style={imageStyle} />}
        </div>
    )
}