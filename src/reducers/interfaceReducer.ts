import { Sound } from "../models/Sound"

type Action =
    { type: "GoToLevelsView" } |
    { type: "GoToSettingsView" } |
    { type: "GoToHome" } |
    { type: "GoToPlayView" } |
    { type: "ShowMenuOfGame", isShow: boolean }|
    { type: "ChangeMusic", music: Sound }|
    { type: "ChangeSound", sound: Sound }
    ;

export default function intefaceReducer(state: GetBox, actions: Action) {
    const _actions = {
        GoToLevelsView: () => {
            return {
                ...state,
                levelsView: true,
                playView: false,
                confetti: false,
                menuGame: false,
                tile_seleted: undefined,
                old_tile_seleted: undefined,
            }
        },
        GoToSettingsView: () => {
            return { ...state, settingView: true }
        },
        GoToHome: () => {
            return {
                ...state,
                levelsView: false,
                settingView: false,
            }
        },
        GoToPlayView: () => {
            return { ...state, playView: true, levelsView: false }
        },
        ShowMenuOfGame: () => {
            return { ...state, menuGame: actions.isShow }
        },
        ChangeMusic: () => {
            return { ...state, music: actions.music }
        },
        ChangeSound: () => {
            return { ...state, sound: actions.sound }
        },
        default: () => null
    };

    return (_actions[actions.type] || _actions["default"])();
}