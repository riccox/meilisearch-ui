import { useAppStore } from "@/store";
import { isSingletonMode } from "@/lib/conn";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { useMatchRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const DashBreadcrumb = () => {
	const matchRoute = useMatchRoute();
	const { t } = useTranslation();

	const insRoute = matchRoute({
		to: "/ins/$insID",
		fuzzy: true,
	}) as unknown as { insID: string };
	const insKeysRoute = matchRoute({
		to: "/ins/$insID/keys",
		fuzzy: true,
	}) as unknown as { insID: string };
	const insTasksRoute = matchRoute({
		to: "/ins/$insID/tasks",
		fuzzy: true,
	}) as unknown as { insID: string };
	const indexRoute = matchRoute({
		to: "/ins/$insID/index/$indexUID",
		fuzzy: true,
	}) as unknown as { indexUID: string };
	const indexDocsRoute = matchRoute({
		to: "/ins/$insID/index/$indexUID/documents",
		fuzzy: true,
	});
	const indexDocsUploadRoute = matchRoute({
		to: "/ins/$insID/index/$indexUID/documents/upload",
		fuzzy: true,
	});
	const indexSettingRoute = matchRoute({
		to: "/ins/$insID/index/$indexUID/setting",
		fuzzy: true,
	});

	const currentInstance = useAppStore((state) =>
		state.instances.find((i) => i.id === Number.parseInt(insRoute.insID)),
	);

	const baseUrl =
		import.meta.env.BASE_URL === "/" ? "" : (import.meta.env.BASE_URL ?? "");

	return (
		<Breadcrumbs color="primary" variant="light">
			{!isSingletonMode() && (
				<BreadcrumbItem href={`${baseUrl || "/"}`}>🏠</BreadcrumbItem>
			)}
			{insRoute && (
				<BreadcrumbItem href={`${baseUrl}/ins/${insRoute.insID}`}>
					{isSingletonMode()
						? "🏠"
						: `#${insRoute.insID} ${t("common:instance")} ${currentInstance?.name}`}
				</BreadcrumbItem>
			)}
			{insKeysRoute && (
				<BreadcrumbItem
					href={`${baseUrl}/ins/${insRoute.insID}/keys`}
				>{`${t("common:keys")}`}</BreadcrumbItem>
			)}
			{insTasksRoute && (
				<BreadcrumbItem
					href={`${baseUrl}/ins/${insRoute.insID}/tasks`}
				>{`${t("common:tasks")}`}</BreadcrumbItem>
			)}
			{indexRoute && (
				<BreadcrumbItem
					href={`${baseUrl}/ins/${insRoute.insID}/index/${indexRoute.indexUID}`}
				>{`${t("common:indexes")}: ${indexRoute.indexUID}`}</BreadcrumbItem>
			)}
			{indexDocsRoute && (
				<BreadcrumbItem
					href={`${baseUrl}/ins/${insRoute.insID}/index/${indexRoute.indexUID}/documents`}
				>{`${t("documents")}`}</BreadcrumbItem>
			)}
			{indexDocsUploadRoute && (
				<BreadcrumbItem
					href={`${baseUrl}/ins/${insRoute.insID}/index/${indexRoute.indexUID}/documents/upload`}
				>{`${t("upload:title")}`}</BreadcrumbItem>
			)}
			{indexSettingRoute && (
				<BreadcrumbItem
					href={`${baseUrl}/ins/${insRoute.insID}/index/${indexRoute.indexUID}/setting`}
				>{`${t("settings")}`}</BreadcrumbItem>
			)}
		</Breadcrumbs>
	);
};
