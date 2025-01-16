import type React from "react";
import { toast as sonner } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-namespace
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
	});
};
const remove = (id?: Toast.ID) => sonner.dismiss(id);

export const toast = Object.assign(base, {
	success,
	error,
	info,
	remove,
	loading,
});
