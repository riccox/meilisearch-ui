import { Copyable } from "@/components/Copyable";
import { Footer } from "@/components/Footer";
import { IndexList } from "@/components/IndexList";
import { DumpButton } from "@/components/dump";
import { InsFormModal } from "@/components/instanceFormModal";
import { LoaderPage } from "@/components/loader";
import { TimeAgo } from "@/components/timeago";
import { TitleWithUnderline } from "@/components/title";
import { useCurrentInstance } from "@/hooks/useCurrentInstance";
import { useInstanceHealth } from "@/hooks/useInstanceHealth";
import { useInstanceStats } from "@/hooks/useInstanceStats";
import { useMeiliClient } from "@/hooks/useMeiliClient";
import { isSingletonMode } from "@/utils/conn";
import { Tooltip } from "@arco-design/web-react";
import { Descriptions, Skeleton, Tag } from "@douyinfe/semi-ui";
import { Button } from "@nextui-org/react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { filesize } from "filesize";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

function InsDash() {
	const { t } = useTranslation("instance");
	const currentInstance = useCurrentInstance();
	const client = useMeiliClient();
	const stats = useInstanceStats(client);
	const isHealth = useInstanceHealth(client);

	const insDescriptionsData = useMemo(() => {
		return [
			{
				key: t("host"),
				value: <Copyable>{currentInstance.host}</Copyable>,
			},
			{
				key: t("common:updated_at"),
				value: <TimeAgo date={currentInstance.updatedTime} />,
			},
			{
				key: t("db_size"),
				value: (
					<Skeleton
						placeholder={<Skeleton.Title />}
						active
						loading={!stats?.databaseSize}
					>
						{filesize(stats?.databaseSize ?? 0)}
					</Skeleton>
				),
			},
			{
				key: t("status.label"),
				value: isHealth ? (
					<Tag color="green">{t("status.available")}</Tag>
				) : (
					<Tag color="amber">{t("unknown")}</Tag>
				),
			},
			{
				key: t("version.label"),
				value: (
					<Skeleton
						placeholder={<Skeleton.Title />}
						active
						loading={!stats?.version}
					>
						<Tag>{stats?.version.pkgVersion}</Tag>
					</Skeleton>
				),
			},
		];
	}, [
		currentInstance.host,
		currentInstance.updatedTime,
		isHealth,
		stats?.databaseSize,
		stats?.version,
		t,
	]);

	return (
		<div className="flex-1 grid grid-cols-4 overflow-scroll">
			<main className="p-4 laptop:col-start-2 laptop:col-end-4 col-start-1 col-end-5 flex flex-col gap-4">
				{!isSingletonMode() && (
					<div className="flex flex-row gap-4 items-baseline">
						<TitleWithUnderline>{`#${currentInstance.id} ${currentInstance.name}`}</TitleWithUnderline>
						<InsFormModal ins={currentInstance} type="edit">
							<Tooltip content={t("edit")} position="right" mini>
								<div className="i-lucide:edit w-1em h-1em cursor-pointer hover:scale-90 transition" />
							</Tooltip>
						</InsFormModal>
					</div>
				)}
				<div className="flex">
					<Descriptions
						className="flex-1"
						align="left"
						data={insDescriptionsData}
					/>
					<div className="flex flex-col gap-3 items-start">
						<Link to="keys" from="/ins/$insID">
							<Button variant="light" size="sm">
								<div className="i-lucide:key w-1em h-1em" /> {t("keys")}
							</Button>
						</Link>
						<Link to="tasks" from="/ins/$insID">
							<Button variant="light" size="sm">
								<div className="i-lucide:workflow w-1em h-1em" />
								{t("tasks")}
							</Button>
						</Link>
						<DumpButton />
					</div>
				</div>
				<IndexList client={client} />
			</main>
			<Footer className="col-span-full mt-auto mb-3" />
		</div>
	);
}

export const Route = createFileRoute("/ins/$insID/_layout/")({
	component: InsDash,
	pendingComponent: LoaderPage,
});
