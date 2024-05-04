//
import { Reducer, Action, AnyObject, GlobalState } from "./types";
import { getKeys, setObj } from "./functionalities";

// declare global {
//     var instance: Initialize;
// }

export default function useInitialize(
    reducer?: Reducer,
    initialState?: GlobalState,
    storageName?: string,
): void {
    Initialize.getInstance(reducer, initialState, storageName);
}

export class Initialize {
    private _reducer: Reducer | { key: string, value: Reducer }[];
    private _globalState: GlobalState | { key: string, value: GlobalState }[];
    private static _instance: Initialize;

    public static getInstance(
        reducer?: Reducer,
        initialState?: GlobalState,
        storageName?: string,
    ): Initialize {
        if (!Initialize._instance) {
            if (!reducer || !initialState)
                throw new Error(`${!reducer ? "The reducer parameter is required for instance Initialize." : ""}${!reducer && !initialState ? "\n" : ""}${!initialState ? "The initialState parameter is required for instance Initialize." : ""}`);

            Initialize._instance = new Initialize(reducer, initialState, storageName);
        }

        return Initialize._instance;
    }

    private constructor(reducer: Reducer, initialState: GlobalState, storageName?: string) {
        if (storageName) {
            this._reducer  = [{ key: storageName, value: reducer }];
            this._globalState = [{ key: storageName, value: initialState }];
        } else {
            this._reducer = reducer;
            this._globalState = initialState;
        }
    }

    public get globalState(): GlobalState {
        /*
        let aux = ({ name: "function name", value: this._globalState["function name"] });
        Reflect.deleteProperty(this._globalState, "function name");

        const clone: K = structuredClone(this._globalState);
        Reflect.set(clone, aux.name, aux.value)
        */

        return structuredClone(this._globalState);
    }

    public get reducer(): Reducer {
        return this._reducer;
    }

    updateGlobalState(newState: GlobalState, modifiedProperties: string[]): void {
        if (getKeys(this._globalState).length === 0) {
            getKeys(newState).forEach((key: string) =>
                setObj(this._globalState, key, newState[key])
            );
        } else {
            modifiedProperties.forEach((key: string) => {
                setObj(this._globalState, key, newState[key]);
            });
        }
    }
}