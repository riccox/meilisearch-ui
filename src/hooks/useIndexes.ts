import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { Index, MeiliSearch } from "meilisearch";
import type { IndexesQuery } from "meilisearch/src/types";
import { useEffect, useState } from "react";
import { useCurrentInstance } from "./useCurrentInstance";

export const useIndexes = (
	client: MeiliSearch,
	params?: IndexesQuery,
): [Index[], UseQueryResult] => {
	const currentInstance = useCurrentInstance();
	const host = currentInstance?.host;

	const [indexes, setIndexes] = useState<Index[]>([]);

	const query = useQuery({
		queryKey: ["indexes", host],
		queryFn: async () => {
			return (await client.getIndexes(params)).results;
		},
	});

	useEffect(() => {
		if (query.isSuccess) {
			setIndexes(query.data);
		}
	}, [query.data, query.isSuccess]);

	return [indexes, query];
};
