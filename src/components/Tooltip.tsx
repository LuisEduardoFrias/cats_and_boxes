import { useState } from 'react'
import { Toolt, arrow } from "../models/Tooltip";
import { Point } from "../models/Point";
import "../styles/components/tooltip.css"

export default function Tooltip({ tooltips }: { tooltips: Toolt[] }) {

    const [index, setIndex] = useState(0);

    function handleClick() {
        if (index + 1 === tooltips.length) {
            setIndex(0)
        }
        else {
            setIndex(index + 1)
        }
    }

    const Styles = {
        left: `${tooltips[index].point.x}px`,
        top: `${tooltips[index].point.y}px`
    }

    let point: Point | null;

    switch (tooltips[index].arrow) {
        case arrow.top_left: {
            point = { left: "2px", top: "4px" };
            break;
        }
        case arrow.top_right: {
            point = { right: "2px", top: "4px" }
            break;
        }
        case arrow.none: {
            point = { left: "1000px", top: "1000px" }
            break;
        }
        case arrow.bottom_left: {
            point = {
                left: "2px", bottom: "-4px",
                borderTop: "8px solid #ffffffb2",
                borderBottom: "8px solid transparent"
            }
            break;
        }
        case arrow.bottom_right: {
            point = {
                right: "2px", bottom: "-4px",
                borderTop: "8px solid #ffffffb2",
                borderBottom: "8px solid transparent"
            }
            break;
        }
        default: {
            point = { left: "2px", top: "5px" }
        }
    }

    if (tooltips[index].fn && !tooltips[index].exit)
        tooltips[index].fn();

    const ArrowStyles = {
        ...point
    }

    return (
        <div style={Styles} className="constiner-tooltop">
            <div style={ArrowStyles} className="row"></div>
            <div className="tooltop">
                <p>{`${tooltips[index].message}`}</p>

                <button className="btn-next" onClick={handleClick}>next</button>
                {tooltips[index].exit && <button className="btn-next" onClick={() => tooltips[index]?.fn()}>exit</button>}
            </div>
        </div >)
}