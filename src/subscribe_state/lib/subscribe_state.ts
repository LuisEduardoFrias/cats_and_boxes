
import { useReducer, useEffect } from "react";
import { Action, GlobalState, Dispatch } from "./types";
import { subCribe, middleDistpach, returnStateForSubscribe } from "./functionalities";
import { Initialize } from "./initialize_super_state";

type ObjReducer = {
    value: number;
};

export default function useSubscribeState(
    props: string[] = [],
    postDispatch?: (
        action: Action,
        state: object,
        dispatch: (action: Action) => void
    ) => void
): [GlobalState, Dispatch] {
    const initialized = Initialize.getInstance();

    //reducer
    function reducer(state: ObjReducer, action: Action): any {
        return { value: state.value === 0 ? 1 : 0 };
    }

    const [state, dispatch] = useReducer(reducer, { value: 0 });

    //Get component name/ don't touch it!
    const callerFunction: string =
        new Error().stack?.split("\n")[2].trim().split(" ")[1] ??
        "crypto.randomUUID";


    useEffect(() => {
        //subscribe the component
    }, [props, callerFunction, dispatch])
    subCribe(props, callerFunction, (action: Action) => {
        dispatch(action);
    });


    //Check if a dispatch is added to execute before the execution continues.
    function outDispatch(action: Action) {
        if (postDispatch) {
            postDispatch(
                action,
                initialized.globalState,
                (_action: Action) => {
                    middleDistpach(_action, initialized.reducer);
                }
            );
        } else {
            middleDistpach(action, initialized.reducer);
        }
    }

    return [returnStateForSubscribe(initialized.globalState, callerFunction), outDispatch];
}

export function dispatch(action: Action) {
    middleDistpach(action, Initialize.getInstance().reducer);
}
