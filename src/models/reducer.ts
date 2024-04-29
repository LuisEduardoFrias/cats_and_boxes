import { Point } from "point"
import { handleCollisionWithGats } from "../helpers/helper_reducer"

type Action =
    { type: "ChangeStateViewLevers", isShow: boolean } |
    { type: "ChangeStateViewSettings", isShow: boolean } |
    { type: "ChangeStateViewPlay", isShow: boolean } |
    { type: "ChangeRotation", rotation: 0 | 90 | 180 | 270, tile_name: string } |
    { type: "SeletTile", tile: string | undefined } |
    { type: "SelectLever", lever: number } |
    { type: "Move", position: Point, tile: string }
    ;

export default function reducer(state: GetBox, actions: Action) {
    const _actions = {
        ChangeStateViewLevers: () => {
            return { ...state, viewLevers: actions.isShow }
        },
        ChangeStateViewSettings: () => {
            return { ...state, viewSetting: actions.isShow }
        },
        ChangeStateViewPlay: () => {
            return { ...state, viewGame: actions.isShow }
        },
        ChangeRotation: () => {
            const tiles_position = structuredClone(state.tiles_position);
            tiles_position[actions.tile_name].rotation = actions.rotation;

            const updated_pieces = handleCollisionWithGats(
                structuredClone(state.pieces),
                structuredClone(state.gats_position),
                tiles_position[actions.tile_name],
                actions.tile_name);

            const newState = { ...state, pieces: updated_pieces, edited_grids: [] };
            return { ...newState, tiles_position };
        },
        SeletTile: () => {
            return { ...state, tile_seleted: actions.tile }
        },
        SelectLever: () => {
            return {
                ...state, viewLevers: false,
                viewPlay: true,
                lever: actions.lever,
                tiles_position: state.levers[actions.lever].tiles_position,
                gats_position: state.levers[actions.lever].gats_position,
            }
        },
        Move: () => {
            const tiles_position = structuredClone(state.tiles_position)
            tiles_position[actions.tile].point = actions.position;
            return { ...state, tiles_position }
        },
        ChangeEditedGrids: () => {
            return { ...state, edited_grids: [...actions.gridIds] }
        }
    };

    return _actions[actions.type]();
}