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
            return { ...state, viewPlay: actions.isShow, viewLevers: !actions.isShow }
        },
        ChangeRotation: () => {
            const tiles_position = structuredClone(state.tiles_position);
            tiles_position[actions.tile_name].rotation = actions.rotation;

            /*  const updated_pieces = handleCollisionWithGats(
                  structuredClone(state.pieces),
                  structuredClone(state.gats_position),
                  tiles_position[actions.tile_name],
                  actions.tile_name);
  */
            //  const newState = { pieces: updated_pieces, edited_grids: [] };
            return { ...state, tiles_position, edited_grids: [] };
        },
        SeletTile: () => {

            //todo agregar piesa a grid
            //todo validar que no choque con mas piezas o gratos a menos que sea la caja
            return { ...state, tile_seleted: actions.tile };
        },
        SelectLever: () => {

            const put = {
                viewPlay: true,
                viewLevers: false,
                lever: actions.lever,
                tiles_position: state.levers[actions.lever].tiles_position,
                gats_position: state.levers[actions.lever].gats_position
            }

            return { ...state, ...put };
        },
        Move: () => {
            const tiles_position = structuredClone(state.tiles_position)
            tiles_position[actions.tile].point = actions.position;
            return { ...state, tiles_position, edited_grids: [] }
        },
        ChangeEditedGrids: () => {
            return { ...state, edited_grids: [...actions.gridIds] }
        }
    };

    return _actions[actions.type]();
}