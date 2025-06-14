import type React from "react";
import { toast as sonner } from "sonner";

export namespace Toast {
	export type ID = string | number;
	export type Content = string | React.ReactNode;
	export interface Params {
		icon?: React.ReactNode;
		id?: ID;
		duration?: number;
	}
	export type LoadingParams<T> = Params & {
		label?: Content;
		success?: Content | ((data: T) => Content);
		error?: Content | ((error: unknown) => Content);
	};
}

const base = (content: Toast.Content, params?: Toast.Params): Toast.ID => {
	return sonner(content, params);
};
const success = (content: Toast.Content, params?: Toast.Params): Toast.ID => {
	return sonner.success(content, params);
};
const error = (content: Toast.Content, params?: Toast.Params): Toast.ID => {
	return sonner.error(content, params);
};
const info = (content: Toast.Content, params?: Toast.Params): Toast.ID => {
	return sonner.message(content, params);
};
const loading = <T>(
	promise: Promise<T>,
	params: Toast.LoadingParams<T>,
): Toast.ID => {
	return sonner.promise(promise, {
		loading: params.label,
		success: "Success",
		error: "Error",
		...params,
	}) as Toast.ID;
};
const remove = (id?: Toast.ID) => sonner.dismiss(id);

export const toast = Object.assign(base, {
	success,
	error,
	info,
	remove,
	loading,
});

import type { EnqueuedTask } from "meilisearch";
import { getTaskSubmitMessage } from "../utils/text";

// task status mark
enum TaskStatus {
	TASK_SUCCEEDED = "succeeded",
	TASK_PROCESSING = "processing",
	TASK_FAILED = "failed",
	TASK_ENQUEUED = "enqueued",
	TASK_CANCEL = "canceled",
}

// task status toast
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

// task status theme
export const TaskThemes: Record<TaskStatus, string> = {
	[TaskStatus.TASK_SUCCEEDED]: "success",
	[TaskStatus.TASK_ENQUEUED]: "warn",
	[TaskStatus.TASK_FAILED]: "danger",
	[TaskStatus.TASK_PROCESSING]: "secondary",
	[TaskStatus.TASK_CANCEL]: "info",
};

// show task submit notification
export const showTaskSubmitNotification = (task: EnqueuedTask): void => {
	TaskStatusToast[task.status](getTaskSubmitMessage(task));
};

// show task error notification
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const showTaskErrorNotification = (err: any): void => {
	TaskStatusToast.failed(`Task Fail: ${err.toString()}`);
};
