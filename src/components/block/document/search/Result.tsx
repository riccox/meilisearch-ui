import { useTranslation } from "react-i18next";
import { EmptyArea } from "@/components/common/empty";
import { Loader } from "@/components/common/Loader";
import { cn } from "@/lib/cn";
import { exportToJSON } from "@/utils/file";
import { Button, Radio, RadioGroup } from "@douyinfe/semi-ui";
import { DocumentList } from "@/components/biz/document/List";
import { type FC, useEffect, useState } from "react";
import type { ListType } from "@/components/biz/document/List";
import type { Index } from "meilisearch";

type Props = {
	initialListType?: ListType;
	totalHits: number;
	processingTimeMs: number;
	list: Record<string, unknown>[];
	isLoading: boolean;
	refetchDocs: () => void;
	currentIndex: Index;
	indexPrimaryKey: string;
	onListTypeChange: (v: ListType) => void;
};

export const Result: FC<Props> = ({
	initialListType = "json",
	totalHits,
	processingTimeMs,
	list,
	isLoading,
	refetchDocs,
	currentIndex,
	indexPrimaryKey,
	onListTypeChange,
}) => {
	const { t } = useTranslation("document");

	const [listType, setListType] = useState<ListType>(initialListType);

	useEffect(() => {
		onListTypeChange(listType);
	}, [listType, onListTypeChange]);

	return (
		<div className="flex flex-col gap-4 flex-1">
			<div className={"flex gap-4 items-center"}>
				<p className={"font-extrabold text-2xl"}>{t("search.results.label")}</p>
				<RadioGroup
					type="button"
					buttonSize="middle"
					defaultValue={listType}
					onChange={(e) => setListType(e.target.value)}
				>
					<Radio value={"json"}>JSON</Radio>
					<Radio value={"table"}>{t("search.results.type.table")}</Radio>
					<Radio value={"grid"}>{t("search.results.type.grid")}</Radio>
				</RadioGroup>
				<div
					className={
						"ml-auto flex items-center gap-3 px-4 font-light text-xs text-neutral-500"
					}
				>
					<Button
						type="secondary"
						size="small"
						onClick={() => exportToJSON(list, "search-results")}
					>
						{t("search.results.download")} {`(${totalHits})`}
					</Button>
					<p>
						{t("search.results.total_hits", {
							estimatedTotalHits: totalHits,
						})}
					</p>
					<p>
						{t("search.results.processing_time", {
							processingTimeMs: processingTimeMs,
						})}
					</p>
				</div>
			</div>
			{/* Doc List */}
			<div
				className={cn(
					listType !== "table" && "flex flex-col gap-4",
					listType === "table"
						? "flex-1 overflow-hidden h-full flex flex-col"
						: "overflow-scroll",
				)}
			>
				{isLoading ? (
					<div className={"flex-1 flex justify-center items-center"}>
						<Loader />
					</div>
				) : list.length > 0 ? (
					<DocumentList
						currentIndex={currentIndex}
						type={listType}
						docs={list.map((i) => ({
							indexId: currentIndex.uid,
							content: i,
							primaryKey: indexPrimaryKey,
						}))}
						refetchDocs={refetchDocs}
					/>
				) : (
					<div className="scale-75">
						<EmptyArea />
					</div>
				)}
			</div>
		</div>
	);
};
