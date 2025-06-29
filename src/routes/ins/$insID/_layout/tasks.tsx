import { LoaderPage } from "@/components/common/Loader";
import { Filter } from "@/components/block/task/Filter";
import { TaskList } from "@/components/block/task/List";
import { useCurrentInstance } from "@/hooks/useCurrentInstance";
import { useMeiliClient } from "@/hooks/useMeiliClient";
import { hiddenRequestLoader, showRequestLoader } from "@/lib/loader";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import _ from "lodash";
import type { TasksQuery } from "meilisearch";
import { useEffect, useMemo, useReducer } from "react";
import { z } from "zod";

const searchSchema = z
	.object({
		indexUids: z.string().array().optional(),
		limit: z.number().positive().optional().default(20),
		statuses: z.string().array().optional(),
		types: z.string().array().optional(),
	})
	.partial();

type State = Pick<TasksQuery, "indexUids" | "statuses" | "types"> &
	Required<Pick<TasksQuery, "limit" | "from">>;

const Page = () => {
	const navigate = useNavigate({ from: Route.fullPath });
	const searchParams = Route.useSearch();
	const client = useMeiliClient();
	const currentInstance = useCurrentInstance();

	const host = currentInstance?.host;

	const [state, updateState] = useReducer(
		(prev: State, next: Partial<State>) => {
			return { ...prev, ...next };
		},
		{ ...searchParams } as State,
	);

	useEffect(() => {
		// update search params when state changed
		navigate({
			search: () => ({
				...state,
			}),
		});
	}, [navigate, state]);

	// @ts-expect-error
	const query = useInfiniteQuery({
		queryKey: ["tasks", host, state],
		queryFn: async ({
			pageParam,
		}: { pageParam: { limit: number; from?: number } }) => {
			showRequestLoader();
			console.debug("getTasks", client.config, state);
			return await client.getTasks({
				..._.omitBy(state, _.isEmpty),
				from: pageParam.from,
				limit: pageParam.limit,
			});
		},
		initialPageParam: {
			limit: state.limit,
		},
		getNextPageParam: (lastPage) => {
			return {
				limit: lastPage.limit,
				from: lastPage.next,
			};
		},
	});

	useEffect(() => {
		if (query.isError) {
			console.warn("get meilisearch tasks error", query.error);
		}
		if (!query.isFetching) {
			hiddenRequestLoader();
		}
	}, [query.error, query.isError, query.isFetching]);

	const list = useMemo(() => {
		return (
			query.data?.pages
				.map((page) => page.results)
				.reduce((acc, cur) => acc.concat(cur), []) || []
		);
	}, [query.data?.pages]);

	return useMemo(
		() => (
			<div className="flex-1 max-h-fit overflow-hidden">
				<main className="flex flex-col gap-4 h-full">
					<Filter state={state} updateState={updateState} />
					<TaskList
						fetchNextPage={query.fetchNextPage}
						instanceID={String(currentInstance?.id)}
						list={list}
					/>
				</main>
			</div>
		),
		[currentInstance?.id, state, query, list],
	);
};

export const Route = createFileRoute("/ins/$insID/_layout/tasks")({
	component: Page,
	pendingComponent: LoaderPage,
	validateSearch: searchSchema,
});
