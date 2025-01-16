"use client";

export const downloadFile = ({
	data,
	fileName,
	fileType,
}: { data: BlobPart; fileName: string; fileType: string }) => {
	// Create a blob with the data we want to download as a file
	const blob = new Blob([data], { type: fileType });
	// Create an anchor element and dispatch a click event on it
	// to trigger a download
	const a = document.createElement("a");
	a.download = fileName;
	a.href = window.URL.createObjectURL(blob);
	const clickEvt = new MouseEvent("click", {
		view: window,
		bubbles: true,
		cancelable: true,
	});
	a.dispatchEvent(clickEvt);
	a.remove();
};

export const exportToJSON = (obj: object | object[], fileName: string) => {
	downloadFile({
		data: JSON.stringify(obj),
		fileName: `${fileName}.json`,
		fileType: "text/json",
	});
};
