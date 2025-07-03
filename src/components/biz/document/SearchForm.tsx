import {
	Switch,
	Tooltip,
	Modal,
	Form,
	Dropdown,
	Slider,
	Tag,
	Banner,
	AutoComplete,
	Button as SemiButton,
} from "@douyinfe/semi-ui";
import { NumberInput, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { Button } from "@nextui-org/react";
import {
	IconAlignBoxLeftMiddle,
	IconArrowsSort,
	IconFilter,
	IconSearch,
	IconArrowUp,
	IconArrowDown,
} from "@tabler/icons-react";
import clsx from "clsx";
import { useMemo, useState, useCallback } from "react";
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
		enableHybrid: boolean;
		hybridEmbedder: string;
		hybridSemanticRatio: number;
	}>;
	searchFormError: string | null;
	onFormSubmit: () => void;
	onAutoRefreshChange: (value: boolean) => void;
	submitBtnText: string;
	indexIdEnable?: boolean;
	embedders: string[];
	sortableFields: string[];
};

export const SearchForm = ({
	searchForm,
	searchFormError,
	onFormSubmit,
	submitBtnText,
	indexIdEnable = false,
	isFetching,
	onAutoRefreshChange,
	embedders,
	sortableFields,
}: Props) => {
	const { t } = useTranslation("document");
	const [hybridModalVisible, setHybridModalVisible] = useState(false);

	return useMemo(
		() => (
			<form className={"flex flex-col gap-2 "} onSubmit={onFormSubmit}>
				<Banner
					type="warning"
					className={clsx(!searchFormError && "hidden")}
					description={searchFormError}
					closeIcon={null}
				/>
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
					<Dropdown
						trigger={"hover"}
						position={"bottomLeft"}
						render={
							<Dropdown.Menu>
								<Dropdown.Title>{t("search.form.sort.tip")}</Dropdown.Title>
								{sortableFields.length > 0 && <Dropdown.Divider />}
								{sortableFields.map((field) => (
									<Dropdown.Title key={field}>
										<div className="flex justify-between items-center gap-2 w-full group">
											{field}
											<div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
												<SemiButton
													icon={<IconArrowUp size={16} color="green" />}
													theme="borderless"
													size="small"
													aria-label="asc"
													onClick={() => {
														const shouldAddComma =
															!searchForm.values.sort.trim().endsWith(",") &&
															searchForm.values.sort.trim().length !== 0;
														searchForm.setFieldValue(
															"sort",
															`${searchForm.values.sort.trim()}${
																shouldAddComma ? ", " : ""
															}${field}:asc`,
														);
													}}
												/>
												<SemiButton
													icon={<IconArrowDown size={16} color="red" />}
													theme="borderless"
													size="small"
													aria-label="desc"
													onClick={() => {
														const shouldAddComma =
															!searchForm.values.sort.trim().endsWith(",") &&
															searchForm.values.sort.trim().length !== 0;
														searchForm.setFieldValue(
															"sort",
															`${searchForm.values.sort.trim()}${
																shouldAddComma ? ", " : ""
															}${field}:desc`,
														);
													}}
												/>
											</div>
										</div>
									</Dropdown.Title>
								))}
							</Dropdown.Menu>
						}
					>
						<TextInput
							className={"flex-1"}
							label={t("search.form.sort.label")}
							leftSection={<IconArrowsSort size={16} />}
							radius="md"
							{...searchForm.getInputProps("sort")}
						/>
					</Dropdown>
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
						<div className="flex items-center gap-2">
							<Button
								type="button"
								color={"default"}
								variant="light"
								size="sm"
								onPress={() => setHybridModalVisible(true)}
							>
								{t("search.form.hybrid.label")}
								{searchForm.values.enableHybrid ? (
									<Tag color="green" size="small" type="solid">
										ON
									</Tag>
								) : (
									<Tag color="red" size="small" type="solid">
										OFF
									</Tag>
								)}
							</Button>
						</div>
						{/* submit btn */}
						<Button type={"submit"} size={"sm"} color={"primary"}>
							{submitBtnText}
						</Button>
					</div>
				</div>
				<Modal
					visible={hybridModalVisible}
					title={t("search.form.hybrid.label")}
					onOk={() => {
						if (searchForm.values.enableHybrid) {
							if (
								searchForm.validateField("hybridEmbedder").hasError ||
								searchForm.validateField("hybridSemanticRatio").hasError
							) {
								return;
							}
						}
						setHybridModalVisible(false);
					}}
					okText={t("common:confirm")}
					closeOnEsc
					onCancel={() => setHybridModalVisible(false)}
					hasCancel={false}
				>
					<Form className="space-y-4">
						<label className="grid gap-2">
							{t("common:enable")}
							<Switch
								checked={searchForm.values.enableHybrid}
								onChange={(v) => searchForm.setFieldValue("enableHybrid", v)}
							/>
						</label>
						<label className="grid gap-2">
							{t("search.form.hybrid.embedder")}
							<AutoComplete
								data={embedders}
								showClear
								disabled={!searchForm.values.enableHybrid}
								{...searchForm.getInputProps("hybridEmbedder")}
								style={{ width: "100%" }}
							/>
							{searchForm.values.enableHybrid &&
								searchForm.errors.hybridEmbedder && (
									<p className="text-sm text-red-500">
										{searchForm.errors.hybridEmbedder}
									</p>
								)}
						</label>
						<label className="grid gap-2">
							{t("search.form.hybrid.semanticRatio")}
							<Slider
								min={0}
								max={1}
								step={0.01}
								value={searchForm.values.hybridSemanticRatio}
								onChange={(v) =>
									searchForm.setFieldValue("hybridSemanticRatio", v as number)
								}
								marks={{ 0: "0", 0.5: "0.5", 1: "1" }}
								disabled={!searchForm.values.enableHybrid}
							/>
						</label>
					</Form>
				</Modal>
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
			hybridModalVisible,
			embedders,
			sortableFields,
		],
	);
};
