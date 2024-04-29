
export function handleCollisionWithGats(pieces, gats_position, seleted_tile, tile_name) {

    const piece_index = pieces.findIndex(e => e.name === tile_name);
    const index = pieces[piece_index].pieces.findIndex(e => e.rotation === seleted_tile.rotation);
    const boxes = pieces[piece_index].pieces[index].tiles.filter(e => e.img.includes("box"));

    for (let j = 0; j < boxes.length; j++) {
        const box_x = (seleted_tile.point.x + boxes[j].x) - 1;
        const box_y = (seleted_tile.point.y + boxes[j].y) - 1;

        for (let i = 0; i < gats_position.length; i++) {
            if (gats_position[i].point.x == box_x && gats_position[i].point.y == box_y) {
                pieces[piece_index].pieces[index].tiles.filter(e => e.img.includes("box"))[j].has_gat = true;
                break
            } else {
                pieces[piece_index].pieces[index].tiles.filter(e => e.img.includes("box"))[j].has_gat = false;
            }
        }
    }

    return pieces;
}