
type Action =
    { type: "ChangeStateViewLevers", isShow: boolean } |
    { type: "ChangeStateViewSettings", isShow: boolean } |
    { type: "ChangeStateViewPlay", isShow: boolean }
    ;

export default function intefaceReducer(state: GetBox, actions: Action) {
    const _actions = {
        ChangeStateViewLevers: () => {
            return { ...state, viewLevers: actions.isShow }
        },
        ChangeStateViewSettings: () => {
            return { ...state, viewSetting: actions.isShow }
        },
        ChangeStateViewPlay: () => {
            return { ...state, viewPlay: actions.isShow, viewLevers: !actions.isShow }
        },
        default: () => null
    };

    return (_actions[actions.type] || _actions["default"])();
}