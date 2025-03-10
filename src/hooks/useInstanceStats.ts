import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { MeiliSearch, Stats, Version } from "meilisearch";
import { useEffect, useState } from "react";
import { useCurrentInstance } from "./useCurrentInstance";

export type InstanceStats = Stats & { version: Version };

export const useInstanceStats = (client: MeiliSearch) => {
	const currentInstance = useCurrentInstance();
	const host = currentInstance?.host;
	const [stats, setStats] = useState<InstanceStats>();

	const query = useQuery({
		queryKey: ["stats", host],
		queryFn: async () => {
			return {
				...(await client.getStats()),
				version: await client.getVersion(),
			};
		},
	});

	useEffect(() => {
		if (query.isSuccess) {
			setStats(query.data);
		}
		if (query.isError) {
			console.warn("get meilisearch stats error", query.error);
		}
	}, [query.data, query.error, query.isError, query.isSuccess]);

	return [stats, query] as [InstanceStats, UseQueryResult<InstanceStats>];
};
