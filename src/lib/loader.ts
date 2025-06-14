import { toast } from "./toast";

const RequestLoaderID = "request-loader";
let RequestLoaderTimeoutId: NodeJS.Timeout[] = [];

/**
 * Show a request loader
 * @note This is a global loader, it will be shown for all requests
 */
export const showRequestLoader = () => {
	console.debug("show loader");

	const tid = setTimeout(() => {
		// pull current tid from queue
		const arr = [...RequestLoaderTimeoutId];
		arr.splice(
			arr.findIndex((e) => e === tid),
			1,
		);
		RequestLoaderTimeoutId = arr;
		toast.loading(
			new Promise(() => {
				// longest 3s
				setTimeout(() => toast.remove(RequestLoaderID), 5000);
			}),
			{
				label: "Request loading...",
				success: "Request completed",
				error: "Request failed",
				id: RequestLoaderID,
			},
		);
		// just show loader for slow request(>=2s)
	}, 2000);
	RequestLoaderTimeoutId.push(tid);
};

// hide request loader
export const hiddenRequestLoader = () => {
	// clearTimeout(RequestLoaderTimeoutId[0]);
	// RequestLoaderTimeoutId.splice(0, 1);
	RequestLoaderTimeoutId.forEach((i) => clearTimeout(i));
	RequestLoaderTimeoutId = [];
	toast.remove(RequestLoaderID);
};

const ConnectionTestLoaderID = "conn-test-loader";

// connection test loader
export const showConnectionTestLoader = () => {
	toast.loading(new Promise(() => {}), {
		label: "Connection testing...",
		id: ConnectionTestLoaderID,
		duration: Number.POSITIVE_INFINITY,
	});
};

// hide connection test loader
export const hiddenConnectionTestLoader = () => {
	toast.remove(ConnectionTestLoaderID);
};
