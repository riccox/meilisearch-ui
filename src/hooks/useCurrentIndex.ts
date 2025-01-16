import { toast } from "@/utils/toast";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "@tanstack/react-router";
import _ from "lodash";
import type { MeiliSearch } from "meilisearch";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useCurrentIndex = (client: MeiliSearch) => {
	const { history } = useRouter();
	const { t, i18n } = useTranslation("index");
	const { indexUID, insID } = useParams({ strict: false }) as {
		insID: string;
		indexUID: string;
	};

	const query = useSuspenseQuery({
		queryKey: ["index", insID, indexUID],
		queryFn: async () => {
			console.debug("getting current index", client.config);
			return await client.getIndex(indexUID);
		},
	});

	const ready = useMemo(
		() => query.isFetched && !_.isEmpty(query.data),
		[query.data, query.isFetched],
	);

	useEffect(() => {
		if (query.isFetched && _.isEmpty(query.data)) {
			console.debug("useCurrentIndex", "lost index", query.data);
			toast.error(`${t("not_found")} 🤥`);
			history.back();
		}
	}, [history, query.data, query.isFetched, i18n.resolvedLanguage, t]);

	return { index: query.data, ready, query };
};
