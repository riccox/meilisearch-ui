import { LoaderPage } from "@/components/loader";
import { useCurrentIndex } from "@/hooks/useCurrentIndex";
import { useInstanceStats } from "@/hooks/useInstanceStats";
import { useMeiliClient } from "@/hooks/useMeiliClient";
import { Statistic } from "@arco-design/web-react";
import { createFileRoute } from "@tanstack/react-router";
import ReactECharts from "echarts-for-react";
import type { FieldDistribution } from "meilisearch";
import { useTranslation } from "react-i18next";

const Page = () => {
	const { t } = useTranslation("index");
	const client = useMeiliClient();
	const currentIndex = useCurrentIndex(client);
	const stats = useInstanceStats(client);

	const fieldDistribution: FieldDistribution =
		stats?.indexes[currentIndex.index.uid].fieldDistribution ?? {};

	return (
		<div className="grid grid-cols-6 h-full overflow-y-scroll">
			<main className="p-4 laptop:col-start-2 laptop:-col-end-2 col-start-1 -col-end-1 flex flex-col gap-4">
				<div className="flex flex-col gap-4 px-1">
					<Statistic
						title={
							<div className="text-1rem text-black font-bold">{t("count")}</div>
						}
						value={stats?.indexes[currentIndex.index.uid].numberOfDocuments}
						countUp
						loading={!stats?.indexes[currentIndex.index.uid]}
						styleValue={{ color: "green" }}
						groupSeparator
					/>
				</div>
				<ReactECharts
					option={{
						title: {
							text: `${t("fieldDistribution.label")} (${t("fieldDistribution.tip")})`,
							textStyle: { fontSize: "1rem", color: "black" },
							subtext: t("fieldDistribution.subtitle"),
							sublink: "https://www.meilisearch.com/docs/reference/api/stats",
						},
						legend: {
							top: "50%",
							left: "right",
							orient: "vertical",
						},
						tooltip: {
							trigger: "item",
							formatter: "{b} : {c} ({d}%)",
						},
						toolbox: {
							show: true,
							feature: {
								mark: { show: true },
								saveAsImage: { show: true },
							},
						},
						series: [
							{
								type: "pie",
								radius: [50, 250],
								center: ["50%", "50%"],
								roseType: "area",
								itemStyle: {
									normal: {
										borderRadius: 8,
										label: {
											show: true,
											position: "inner",
											formatter: (params: any) =>
												`${params.name}(${params.value})`,
										},
										labelLine: {
											show: false,
										},
									},
								},
								data: Object.entries(fieldDistribution)
									.map(([k, v]) => ({ name: k, value: v }))
									.sort((a, b) => b.value - a.value)
									.slice(0, 10),
							},
						],
					}}
					notMerge={true}
					lazyUpdate={true}
					className="!h-full"
				/>
			</main>
		</div>
	);
};

export const Route = createFileRoute(
	"/ins/$insID/_layout/index/$indexUID/_layout/",
)({
	component: Page,
	pendingComponent: LoaderPage,
});
