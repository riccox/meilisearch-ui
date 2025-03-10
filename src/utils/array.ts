export const arrayMove = <T = unknown>(
	arr: T[],
	old_index: number,
	new_index: number,
): T[] => {
	let oldIndex = old_index;
	let newIndex = new_index;
	while (oldIndex < 0) {
		oldIndex += arr.length;
	}
	while (newIndex < 0) {
		newIndex += arr.length;
	}
	if (newIndex >= arr.length) {
		let k = newIndex - arr.length + 1;
		while (k--) {
			// @ts-ignore
			arr.push(undefined);
		}
	}
	arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
	return arr;
};
