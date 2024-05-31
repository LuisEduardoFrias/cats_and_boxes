import { Sound } from "../models/Sound"
import type { selectAll } from "../models/SelectAll"
import { levelBuildHelper } from "../helpers/levelBuilderFunctionHelper"

type Action =
    { type: "GoToLevelsView" } |
    { type: "GoToSettingsView" } |
    { type: "GoToHome" } |
    { type: "GoToPlayView" } |
    { type: "ShowMenuOfGame", isShow: boolean } |
    { type: "ChangeMusic", music: Sound } |
    { type: "ChangeSound", sound: Sound } |
    { type: "GoToTutorialView", isShow: Sound } |
    { type: "SelectAll", SelectAll: selectAll }
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
        GoToTutorialView: () => {

            const put = {
                movements: 0,
                gatsInBixes: [],
                boxChangeImg: [],
                shadow_in_grid: [],
                confetti: false,
                tile_seleted: undefined,
                level: 4,
                ...levelBuildHelper(4)
            }

            return { ...state, ...put, tutorialView: actions.isShow }
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
        SelectAll: () => {
            return { ...state, selectAll: actions.SelectAll }
        },
        default: () => null
    };

    return (_actions[actions.type] || _actions["default"])();
}