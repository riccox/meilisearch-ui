import { Switch, Tooltip } from "@douyinfe/semi-ui";
import { NumberInput, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { Button } from "@nextui-org/react";
import {
	IconAlignBoxLeftMiddle,
	IconArrowsSort,
	IconFilter,
	IconSearch,
} from "@tabler/icons-react";
import clsx from "clsx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type Props = {
	isFetching: boolean;
	searchForm: UseFormReturnType<{
		q: string;
		offset: number;
		limit: number;
		filter: string;
		sort: string;
		indexId?: string;
		showRankingScore: boolean;
	}>;
	searchFormError: string | null;
	onFormSubmit: () => void;
	onAutoRefreshChange: (value: boolean) => void;
	submitBtnText: string;
	indexIdEnable?: boolean;
};

export const SearchForm = ({
	searchForm,
	searchFormError,
	onFormSubmit,
	submitBtnText,
	indexIdEnable = false,
	isFetching,
	onAutoRefreshChange,
}: Props) => {
	const { t } = useTranslation("document");

	return useMemo(
		() => (
			<form className={"flex flex-col gap-2 "} onSubmit={onFormSubmit}>
				<div
					className={clsx(
						"prompt danger ghost xs",
						!searchFormError && "hidden",
					)}
				>
					<div className="icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="icon icon-tabler icon-tabler-alert-triangle"
							width={18}
							height={18}
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M10.24 3.957l-8.422 14.06a1.989 1.989 0 0 0 1.7 2.983h16.845a1.989 1.989 0 0 0 1.7 -2.983l-8.423 -14.06a1.989 1.989 0 0 0 -3.4 0z" />
							<path d="M12 9v4" />
							<path d="M12 17h.01" />
						</svg>
					</div>
					<div className="content">
						<p>{searchFormError}</p>
					</div>
				</div>
				{indexIdEnable && (
					<TextInput
						leftSection={<IconAlignBoxLeftMiddle size={16} />}
						radius="md"
						placeholder={t("search.form.indexId.placeholder")}
						required
						{...searchForm.getInputProps("indexId")}
					/>
				)}
				<TextInput
					leftSection={<IconSearch size={16} />}
					autoFocus
					radius="md"
					placeholder={t("search.form.q.placeholder")}
					{...searchForm.getInputProps("q")}
				/>
				<div className={"flex items-center gap-4"}>
					<TextInput
						className={"flex-1"}
						label={t("search.form.filter.label")}
						leftSection={<IconFilter size={16} />}
						radius="md"
						{...searchForm.getInputProps("filter")}
					/>
					<Tooltip content={t("search.form.sort.tip")}>
						<TextInput
							className={"flex-1"}
							label={t("search.form.sort.label")}
							leftSection={<IconArrowsSort size={16} />}
							radius="md"
							{...searchForm.getInputProps("sort")}
						/>
					</Tooltip>
				</div>
				<div className={"flex items-stretch gap-4"}>
					<NumberInput
						radius="md"
						label={t("search.form.limit.label")}
						{...searchForm.getInputProps("limit")}
						min={1}
						allowDecimal={false}
						allowNegative={false}
					/>
					<NumberInput
						radius="md"
						label={t("search.form.offset.label")}
						{...searchForm.getInputProps("offset")}
						allowDecimal={false}
						allowNegative={false}
					/>

					{/* right btn group */}
					<div className={"ml-auto mt-auto flex gap-x-4 items-center"}>
						<Tooltip
							position="bottom"
							content={t("search.form.showRankingScore.tip")}
						>
							<div className="flex items-center gap-2">
								<div className="text-sm" defaultChecked={false}>
									{t("search.form.showRankingScore.label")}
								</div>
								<Switch {...searchForm.getInputProps("showRankingScore")} />
							</div>
						</Tooltip>
						<Tooltip
							position="bottom"
							content={t("search.form.autoRefresh.tip")}
						>
							<div className="flex items-center gap-2">
								<div className="text-sm" defaultChecked={false}>
									{t("search.form.autoRefresh.label")}
								</div>
								<Switch
									loading={isFetching}
									onChange={(v) => onAutoRefreshChange(v)}
								/>
							</div>
						</Tooltip>
						{/* submit btn */}
						<Button type={"submit"} size={"sm"} color={"primary"}>
							{submitBtnText}
						</Button>
					</div>
				</div>
			</form>
		),
		[
			onFormSubmit,
			searchFormError,
			indexIdEnable,
			t,
			searchForm,
			isFetching,
			submitBtnText,
			onAutoRefreshChange,
		],
	);
};
