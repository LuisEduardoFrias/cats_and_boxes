import React, { useEffect, useState } from 'react';
import "../styles/open_close.css"

type TOpenClose = {
    children: React.ReactNode;
    dependecies: [];
    notInitialize: boolean
};

export default function OpenClose({ children, dependecies, notInitialize }: TOpenClose) {
    const [openclose, setOpenClose] = useState(false);
    const [_notInitialize, setNotInitialize] = useState(!notInitialize);
    const [oldChild, setOldChild] = useState(children);

    useEffect(() => {
        new Promise(() => {
            const timer = setTimeout(() => {
                setOldChild(children)
            }, 2000);
        })
    }, [children])

    useEffect(() => {
        new Promise(() => {
            const timer = setTimeout(() => {
                setOpenClose(false);
            }, 3000);
        })

        //setOpenClose(true);
        if (_notInitialize) {
        }
        else {
            //setNotInitialize(true)
        }
    }, dependecies);

    return (
        <article className="doors">
            <div className="door" style={{ animationPlayState: openclose ? "running" : "paused" }}></div>
            <div className="door" style={{ animationPlayState: openclose ? "running" : "paused" }}></div>
            {oldChild}
        </article>
    );
}