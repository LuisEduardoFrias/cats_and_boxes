import { useDroppable } from '@dnd-kit/core';
import { children } from "react"

interface IBoardProps {
    children: Children
}

export default function Board({ children }: IBoardProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: 'droppable',
    });
    const style = {
        color: isOver ? 'green' : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} className="tablero" >
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            <div className="azulejo"></div>
            {children}
        </div>
    )
}