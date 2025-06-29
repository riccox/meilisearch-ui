import type { Task } from "meilisearch";
import { getDuration, getDurationMs } from "@/utils/text";
import { Modal, Table } from "@douyinfe/semi-ui";
import type { ColumnProps } from "@douyinfe/semi-ui/lib/es/table";
import { Button } from "@nextui-org/react";
import { useMemo, type FC } from "react";
import { useTranslation } from "react-i18next";
import { TimeAgo } from "@/components/common/Timeago";
import { CountUp } from "@/components/common/CountUp";
import { JsonEditor } from "@/components/common/JsonEditor";
import { Link } from "@tanstack/react-router";
import { Loader } from "@/components/common/Loader";

export const TaskList: FC<{
	fetchNextPage: () => void;
	instanceID: string;
	list: Task[];
}> = ({ fetchNextPage, instanceID, list }) => {
	const { t } = useTranslation("task");

	const columns: ColumnProps<Task>[] = useMemo(
		() => [
			{
				title: "UID",
				dataIndex: "uid",
				width: 100,
			},
			{
				title: t("indexes"),
				dataIndex: "indexUid",
				render: (val) =>
					val ? (
						<Link
							// "/ins/$insID/index/$indexUID" type fix
							// @ts-expect-error
							to={`/ins/${String(instanceID)}/index/${String(val)}`}
						>
							{val}
						</Link>
					) : (
						"-"
					),
			},
			{
				title: t("common:type"),
				dataIndex: "type",
				render: (_) => <p className="break-all">{t(`type.${_}`)}</p>,
			},
			{
				title: t("common:status"),
				dataIndex: "status",
				width: 120,
				render: (_) => <p className="whitespace-nowrap">{t(`status.${_}`)}</p>,
			},
			{
				title: t("duration"),
				dataIndex: "duration",
				width: 200,
				render: (_, item) => {
					if (!item.duration) {
						if (item.status === "processing" || item.status === "enqueued") {
							return (
								<div className="flex items-center gap-2">
									<Loader size="sm" />
									<CountUp start={item.startedAt || item.enqueuedAt} />
								</div>
							);
						}
						return "-";
					}

					return (
						<p title={`${getDurationMs(item.duration)}ms`}>
							{getDuration(item.duration)}
						</p>
					);
				},
			},
			{
				title: t("enqueued_at"),
				dataIndex: "enqueuedAt",
				width: 220,
				render: (_, item) => {
					return <TimeAgo date={item.enqueuedAt} />;
				},
			},
			{
				title: t("started_at"),
				dataIndex: "startedAt",
				width: 220,
				render: (_, item) => {
					return <TimeAgo date={item.startedAt} />;
				},
			},
			{
				title: t("finished_at"),
				dataIndex: "finishedAt",
				width: 220,
				render: (_, item) => {
					if (item.status === "processing" || item.status === "enqueued") {
						return "-";
					}
					return <TimeAgo date={item.finishedAt} />;
				},
			},
			{
				title: t("actions"),
				fixed: "right",
				width: 150,
				render: (_, record) => (
					<div className="flex justify-center items-center gap-2">
						<Button
							size="sm"
							onPress={() => {
								Modal.info({
									title: t("common:detail"),
									centered: true,
									footer: null,
									size: "large",
									content: (
										<div className="flex justify-center items-center p-2 pl-0 pb-6">
											<JsonEditor
												lineNumbers={false}
												className="max-h-[80vh] flex-1 overflow-scroll"
												defaultValue={JSON.stringify(record, null, 2)}
												readonly
												onChange={() => {}}
											/>
										</div>
									),
								});
							}}
							variant="flat"
						>
							{t("common:detail")}
						</Button>
					</div>
				),
			},
		],
		[instanceID, t],
	);

	return (
		<div
			className="p-2 overflow-scroll"
			onScroll={(e) => {
				// @ts-expect-error
				const { scrollTop, clientHeight, scrollHeight } = e.target;
				if (Math.abs(scrollHeight - (scrollTop + clientHeight)) <= 1) {
					fetchNextPage();
				}
			}}
		>
			<Table
				columns={columns}
				dataSource={list}
				pagination={false}
				empty={t("empty")}
			/>
		</div>
	);
};
