import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { useAppStore } from "@/store";
import { Button } from "@mantine/core";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

function Warning() {
	const { history } = useRouter();
	const { t } = useTranslation("sys");
	const warningPageData = useAppStore((state) => state.warningPageData);
	return (
		<div className="full-page bg-night gap-y-10 justify-center items-center">
			<div className={"flex gap-6 items-center"}>
				<Logo />
				<h1 className={"text-4xl font-bold text-primary-100"}>
					{t("warning")}
				</h1>
			</div>
			{warningPageData?.prompt && (
				<p
					className={
						"text-primary-100 font-semibold text-base whitespace-pre-line text-balance text-center"
					}
				>
					{warningPageData.prompt}
				</p>
			)}
			<div className="flex gap-3">
				<Button
					color={"orange"}
					onClick={() => window.location.assign(window.location.origin)}
				>
					{t("reload")}
				</Button>
				<Button
					variant={"gradient"}
					color={"blue"}
					onClick={() => history.back()}
				>
					{t("back")}
				</Button>
			</div>
			<Footer />
		</div>
	);
}

export const Route = createFileRoute("/warning")({
	component: Warning,
});
