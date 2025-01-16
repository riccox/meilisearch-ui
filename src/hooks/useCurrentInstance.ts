import { type Instance, useAppStore } from "@/store";
import { getSingletonCfg, isSingletonMode } from "@/utils/conn";
import { useParams } from "@tanstack/react-router";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { toast } from "../utils/toast";

export const useCurrentInstance = () => {
	const { t } = useTranslation("instance");
	const { insID } = useParams({ strict: false }) as { insID: string };
	let currentInstance = useAppStore((state) =>
		state.instances.find((i) => i.id === Number.parseInt(insID || "1")),
	);
	const setWarningPageData = useAppStore((state) => state.setWarningPageData);

	if (!isSingletonMode()) {
		if (currentInstance && _.isEmpty(currentInstance)) {
			toast.error(`${t("not_found")} 🤥`);
			console.debug("useCurrentInstance", "Instance lost");
			// do not use useNavigate, because maybe in first render
			window.location.assign(import.meta.env.BASE_URL ?? "/");
		}
		return currentInstance as Instance;
	}
	currentInstance = getSingletonCfg() as Instance;
	if (!currentInstance) {
		toast.error(`${t("not_found")} 🤥`);
		console.debug("useCurrentInstance", "Singleton Instance lost");
		setWarningPageData({ prompt: t("instance:singleton_cfg_not_found") });
		// do not use useNavigate, because maybe in first render
		if (import.meta.env.BASE_URL !== "/") {
			window.location.assign(`${import.meta.env.BASE_URL || ""}/warning`);
		} else {
			window.location.assign("/warning");
		}
	}
	return currentInstance as Instance;
};
