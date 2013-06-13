exports.height = 200;
exports.width  = 200;
exports.mouse_pos = [0, 0];

/**
 * Set's the position of a sprite's rect
 */
function get_position(true_pos, center, dim, angle) {
	if (angle > 360) {
		angle = angle%360;
	} while (angle < 0) {
		angle += 360;
	}
	var la = dim[1]*center[1]
	var lb = dim[0]*center[0]
	var lc = dim[1]*(1-center[1])
	var ld = dim[0]*(1-center[0])

	if (angle < 90) {
		return get_xy(angle, la, lb, ld, true_pos)
	} else if (angle < 180) {
		return get_xy(angle-90, ld, la, lc, true_pos)
	} else if (angle < 270) {
		return get_xy(angle-180, lc, ld, lb, true_pos)
	} else {
		return get_xy(angle-270, lb, lc, la, true_pos)
	}
};
function get_xy(angle, l1, l2, l3, true_pos) {
	var sin = Math.sin(angle / 180 * Math.PI);
	var cos = Math.cos(angle / 180 * Math.PI);
	var x = true_pos[0] - l1*sin - l2*cos;
	var y = true_pos[1] - l1*cos - l3*sin;
	return [x, y];
}

exports.get_position = get_position;