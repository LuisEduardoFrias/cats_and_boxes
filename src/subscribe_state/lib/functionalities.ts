/**
*/
import {
    Action,
    OutReducer,
    Reducer,
    GlobalState,
    AnyObject,
    Dispatch,
    SubCriber
} from "./types";
import { ALL, SUB_CRIBER } from "./constants";
import { Initialize } from "./initialize_super_state";

//exact comparison of two objects
function equal(obj1: GlobalState, obj2: GlobalState) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function setObj(obj: object, prop: string, value: any): void {
    Reflect.set(obj, prop, value);
}

export function getKeys(obj: object): string[] {
    return Reflect.ownKeys(obj) as string[];
}

//subCribe the components

export function subCribe(
    props: string[],
    id: string,
    dispatch: Dispatch
): void {
    SUB_CRIBER[id] = {
        props,
        dispatch
    };
}

//intermediator of the dispatch
export function middleDistpach(action: Action, reducer: Reducer): void {
    //
    const initialized = Initialize.getInstance();

    const newState: GlobalState = reducer(
        initialized.globalState,
        action
    );

    const changedProperties: string[] = getChangedProperties(
        initialized.globalState,
        newState
    );

    initialized.updateGlobalState(newState, changedProperties);

    //Probocar el cambio de estado en los useReducers de los suscriptores.
    if (changedProperties.length > 0) {
        Reflect.ownKeys(SUB_CRIBER).forEach((key: string) => {
            //console.log(`sub ${key}`)

            const props = Reflect.get(SUB_CRIBER, key).props;

            for (let i = 0; i < props.length; i++) {
                //console.log(`props: ${props} - ${i}`)

                let isBreak = false;

                for (let j = 0; j < changedProperties.length; j++) {

                    //console.log(`ch-p: ${changedProperties} - ${j}`)

                    if (changedProperties[j] === props[i] || changedProperties[j] === ALL) {

                        //console.log("isBreak")
                        const promesa = new Promise((resolve, reject) => {
                            SUB_CRIBER[key].dispatch({ type: "any" })
                            resolve(true);
                        });
                        promesa.then((property) => { });
                       
                        isBreak = true;
                        break;
                    }
                }

                if (isBreak) {
                    isBreak = false;
                    break;
                }
            }
        })
    }
}

//retorna las propiedades que an sido actializadas.
function getChangedProperties(
    oldState: GlobalState,
    newState: GlobalState
): string[] {
    const changedProperties: string[] = [];
    for (const key in newState) {
        if (!equal(oldState[key], newState[key])) {
            changedProperties.push(key);
        }
    }
    return changedProperties;
}

//returns the state with the specific properties of a subscriber
export function returnStateForSubscribe(
    state: GlobalState,
    callerFunction: string
): GlobalState {
    const newState: GlobalState = {};

    if (SUB_CRIBER[callerFunction]) {
        const pros: string[] = SUB_CRIBER[callerFunction].props;

        for (let i: number = 0; i < pros.length; i++) {
            if (pros[i] === ALL) return state;

            setObj(newState, pros[i], state[pros[i]]);
        }
    }

    return newState;
}
