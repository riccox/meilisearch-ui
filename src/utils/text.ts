import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import type { EnqueuedTask } from "meilisearch";
dayjs.extend(relativeTime);
dayjs.extend(duration);

// get task submit message
export const getTaskSubmitMessage = (task: EnqueuedTask): string => {
	return `Task submit ${task.status}, task uid ${task.taskUid} 🚀`;
};

// get time text (default format: YYYY-MM-DD HH:mm:ss.SSS)
export const getTimeText = (
	date: dayjs.ConfigType,
	{
		defaultText = "-",
		format = "YYYY-MM-DD HH:mm:ss.SSS",
	}: {
		format?: string;
		defaultText?: string;
	} = {},
): string => {
	if (!date && defaultText) {
		return defaultText;
	}
	return dayjs(date).format(format);
};

// get time ago
export const getTimeAgo = (date: dayjs.ConfigType): string => {
	return dayjs(date).fromNow();
};

// get duration
export const getDuration = (date: string): string => {
	return dayjs.duration(date).humanize();
};

export const getDurationMs = (date: string): string => {
	return dayjs.duration(date).asMilliseconds().toString();
};

// stringify json pretty
export const stringifyJsonPretty = (json?: string | object | null) => {
	return JSON.stringify(json, undefined, 2);
};

/*
 * check if the string is a valid date time
 * if the string is a unix timestamp, it will be converted to a date
 */
export function isValidDateTime(str: string): Date | false {
	if (dayjs(str).isValid()) {
		if (/^\d+$/g.test(str) && str.length < 13) {
			// unix timestamp
			return dayjs.unix(Number.parseInt(str)).toDate();
		}
		return dayjs(str).toDate();
	}
	return false;
}

// check if the string is a valid http url
export function isValidHttpUrl(str: string): boolean {
	try {
		const url = new URL(str);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		return false;
	}
}

// check if the string is a valid image url
export function isValidImgUrl(str: string): boolean {
	try {
		const url = new URL(str);
		return (
			(url.protocol === "http:" || url.protocol === "https:") &&
			/\.(jpg|jpeg|png|gif|webp)$/i.test(url.pathname)
		);
	} catch {
		return false;
	}
}

// check if the string is a valid json
export function isValidJSON(str: string): boolean {
	try {
		JSON.parse(str);
		return true;
	} catch {
		return false;
	}
}
