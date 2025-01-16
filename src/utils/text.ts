import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import type { EnqueuedTask } from "meilisearch";
import { toast } from "./toast";
dayjs.extend(relativeTime);
dayjs.extend(duration);

export const getTaskSubmitMessage = (task: EnqueuedTask): string => {
	return `Task submit ${task.status}, task uid ${task.taskUid} 🚀`;
};

enum TaskStatus {
	TASK_SUCCEEDED = "succeeded",
	TASK_PROCESSING = "processing",
	TASK_FAILED = "failed",
	TASK_ENQUEUED = "enqueued",
	TASK_CANCEL = "canceled",
}

const TaskStatusToast: Record<
	TaskStatus,
	(typeof toast)["success"] | (typeof toast)["info"] | (typeof toast)["error"]
> = {
	[TaskStatus.TASK_SUCCEEDED]: toast.success,
	[TaskStatus.TASK_ENQUEUED]: toast.info,
	[TaskStatus.TASK_FAILED]: toast.error,
	[TaskStatus.TASK_PROCESSING]: toast.info,
	[TaskStatus.TASK_CANCEL]: toast.info,
};
export const TaskThemes: Record<TaskStatus, string> = {
	[TaskStatus.TASK_SUCCEEDED]: "success",
	[TaskStatus.TASK_ENQUEUED]: "warn",
	[TaskStatus.TASK_FAILED]: "danger",
	[TaskStatus.TASK_PROCESSING]: "secondary",
	[TaskStatus.TASK_CANCEL]: "info",
};

export const showTaskSubmitNotification = (task: EnqueuedTask): void => {
	TaskStatusToast[task.status](getTaskSubmitMessage(task));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const showTaskErrorNotification = (err: any): void => {
	TaskStatusToast.failed(`Task Fail: ${err.toString()}`);
};

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

export const getTimeAgo = (date: dayjs.ConfigType): string => {
	return dayjs(date).fromNow();
};

export const getDuration = (
	date: string,
	unit: duration.DurationUnitType,
): string => {
	return dayjs.duration(date).get(unit).toPrecision(5).toString();
};

export const stringifyJsonPretty = (json?: string | object | null) => {
	return JSON.stringify(json, undefined, 2);
};

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

export function isValidHttpUrl(str: string): boolean {
	try {
		const url = new URL(str);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		return false;
	}
}

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
