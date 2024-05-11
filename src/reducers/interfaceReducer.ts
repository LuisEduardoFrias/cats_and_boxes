
type Action =
    { type: "ChangeStateViewLevels", isShow: boolean } |
    { type: "ChangeStateViewSettings", isShow: boolean } |
    { type: "ChangeStateViewPlay", isShow: boolean } |
    { type: "ChangeStateViewMenuGame", isShow: boolean }
    ;

export default function intefaceReducer(state: GetBox, actions: Action) {
    const _actions = {
        ChangeStateViewLevels: () => {
            return {
                ...state,
                viewLevels: actions.isShow,
                viewPlay: !actions.isShow,
                confetti: false,
                menuGame: false,
                tile_seleted: undefined,
            old_tile_seleted: undefined,}
    },
        ChangeStateViewSettings: () => {
            return { ...state, viewSetting: actions.isShow }
},
ChangeStateViewPlay: () => {
    return { ...state, viewPlay: actions.isShow, viewlevels: !actions.isShow }
},
    ChangeStateViewMenuGame: () => {
        return { ...state, menuGame: actions.isShow }
    },
        default: () => null
    };

return (_actions[actions.type] || _actions["default"])();
}