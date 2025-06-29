import { TagInput } from "@douyinfe/semi-ui";
import { Select } from "@douyinfe/semi-ui";
import _ from "lodash";
import type { TasksQuery, TaskStatus, TaskTypes } from "meilisearch";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

type State = Pick<TasksQuery, "indexUids" | "statuses" | "types"> &
	Required<Pick<TasksQuery, "limit" | "from">>;

export const Filter: FC<{
	state: State;
	updateState: (next: Partial<State>) => void;
}> = ({ state, updateState }) => {
	const { t } = useTranslation("task");

	return (
		<div
			className={
				"p-4 flex justify-end items-center gap-4 sticky top-0 z-10 bg-white"
			}
		>
			<TagInput
				className="flex-1"
				placeholder={t("filter.index.placeholder")}
				value={state.indexUids}
				onChange={(value) => {
					updateState({ indexUids: value });
				}}
			/>
			<Select
				placeholder={t("filter.type.placeholder")}
				optionList={_.entries(
					t("type", { returnObjects: true }) as Record<string, string>,
				).map(([k, v]) => ({
					value: k,
					label: v,
				}))}
				multiple
				value={state.types}
				onChange={(value) => {
					updateState({ types: (value as TaskTypes[]) || undefined });
				}}
			/>
			<Select
				placeholder={t("filter.status.placeholder")}
				optionList={_.entries(
					t("status", { returnObjects: true }) as Record<string, string>,
				).map(([k, v]) => ({
					value: k,
					label: v,
				}))}
				multiple
				value={state.statuses}
				onChange={(value) => {
					updateState({ statuses: (value as TaskStatus[]) || undefined });
				}}
			/>
		</div>
	);
};
