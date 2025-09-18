import { getSingletonCfg, isSingletonMode } from "@/lib/conn";
import { type Instance, useAppStore } from "@/store";
import { useParams } from "@tanstack/react-router";
import _ from "lodash";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "../lib/toast";

export const useCurrentInstance = () => {
	const { t } = useTranslation("instance");
	const { insID } = useParams({ strict: false }) as { insID: string };
	const instances = useAppStore((state) => state.instances);
	const setWarningPageData = useAppStore((state) => state.setWarningPageData);

	const currentInstance = useMemo(() => {
		if (!isSingletonMode()) {
			return instances.find((i) => i.id === Number.parseInt(insID || "1")) as
				| Instance
				| undefined;
		}
		return getSingletonCfg() as Instance | undefined;
	}, [instances, insID]);

	if (!isSingletonMode()) {
		if (currentInstance && _.isEmpty(currentInstance)) {
			toast.error(`${t("not_found")} 🤥`);
			console.debug("useCurrentInstance", "Instance lost");
			// do not use useNavigate, because maybe in first render
			window.location.assign(import.meta.env.BASE_URL ?? "/");
		}
		return currentInstance as Instance;
	}

	// singleton mode
	if (!currentInstance) {
		toast.error(`${t("not_found")} 🤥`);
		console.debug("useCurrentInstance", "Singleton Instance lost");
		setWarningPageData({ prompt: t("instance:singleton_cfg_not_found") });
		// do not use useNavigate, because maybe in first render
		const baseUrl = (import.meta.env.BASE_URL ?? "").replace(/\/$/, "");
		window.location.assign(`${baseUrl}/warning`);
	}
	return currentInstance as Instance;
};
