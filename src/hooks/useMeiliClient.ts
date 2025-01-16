import { useAppStore } from "@/store";
import { isSingletonMode } from "@/utils/conn";
import _ from "lodash";
import { MeiliSearch } from "meilisearch";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "../utils/toast";
import { useCurrentInstance } from "./useCurrentInstance";

export const useMeiliClient = () => {
	const { t } = useTranslation("instance");
	const currentInstance = useCurrentInstance();

	const [client, setClient] = useState<MeiliSearch>(
		new MeiliSearch({
			...currentInstance,
		}),
	);

	const setWarningPageData = useAppStore((state) => state.setWarningPageData);

	const connect = useCallback(async () => {
		if (_.isEmpty(currentInstance?.host)) {
			toast.error(t("connection_failed"));
			console.debug("useMeilisearchClient", "connection config lost");
			if (!isSingletonMode()) {
				// do not use useNavigate, because maybe in first render
				window.location.assign(import.meta.env.BASE_URL ?? "/");
			} else {
				setWarningPageData({ prompt: t("instance:singleton_cfg_not_found") });
				// do not use useNavigate, because maybe in first render
				if (import.meta.env.BASE_URL !== "/") {
					window.location.assign(`${import.meta.env.BASE_URL || ""}/warning`);
				} else {
					window.location.assign("/warning");
				}
			}
			return;
		}
		const conn = new MeiliSearch({ ...currentInstance });
		try {
			await conn.getStats();
			setClient(conn);
		} catch (err) {
			console.warn("useMeilisearchClient", "test conn error", err);
			toast.error(t("connection_failed"));
			if (!isSingletonMode()) {
				// do not use useNavigate, because maybe in first render
				window.location.assign(import.meta.env.BASE_URL ?? "/");
			} else {
				setWarningPageData({ prompt: t("instance:singleton_cfg_not_found") });
				// do not use useNavigate, because maybe in first render
				if (import.meta.env.BASE_URL !== "/") {
					window.location.assign(`${import.meta.env.BASE_URL || ""}/warning`);
				} else {
					window.location.assign("/warning");
				}
			}
		}
	}, [currentInstance, setWarningPageData, t]);

	// need to use currentInstance as deps, because it should be emitted when instance changed
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		console.debug("useMeilisearchClient", "rebuilt meili client");
		connect().then();
	}, [connect, currentInstance]);

	return client;
};
