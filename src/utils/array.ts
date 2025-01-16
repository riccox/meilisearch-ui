export const arrayMove = <T = unknown>(
	arr: T[],
	old_index: number,
	new_index: number,
): T[] => {
	while (old_index < 0) {
		old_index += arr.length;
	}
	while (new_index < 0) {
		new_index += arr.length;
	}
	if (new_index >= arr.length) {
		let k = new_index - arr.length + 1;
		while (k--) {
			// @ts-ignore
			arr.push(undefined);
		}
	}
	arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	return arr;
};
