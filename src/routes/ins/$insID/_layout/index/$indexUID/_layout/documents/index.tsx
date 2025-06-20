import type { ListType } from "@/components/biz/document/List";
import {
	emptySearchResult,
	searchPageParamsSchema,
	type SearchFormValue,
} from "@/components/block/document/search";
import { Result } from "@/components/block/document/search/Result";
import { SearchBar } from "@/components/block/document/search/SearchBar";
import { LoaderPage } from "@/components/common/Loader";
import { useCurrentIndex } from "@/hooks/useCurrentIndex";
import { useCurrentInstance } from "@/hooks/useCurrentInstance";
import { useMeiliClient } from "@/hooks/useMeiliClient";
import { useForm } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useDebounce from "ahooks/lib/useDebounce";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export const Page = () => {
	const navigate = useNavigate({ from: Route.fullPath });
	const { t } = useTranslation("document");
	const client = useMeiliClient();
	const currentIndex = useCurrentIndex(client);
	const currentInstance = useCurrentInstance();
	const host = currentInstance?.host;

	const indexClient = useMemo(() => {
		return currentIndex ? client.index(currentIndex.index.uid) : undefined;
	}, [client, currentIndex]);

	const searchParams: Required<
		ReturnType<typeof searchPageParamsSchema.parse>
	> = _.defaults(Route.useSearch(), {
		q: "",
		offset: 0,
		limit: 20,
		filter: "",
		sort: "",
		listType: "json",
		showRankingScore: false,
		enableHybrid: false,
		hybridEmbedder: "",
		hybridSemanticRatio: 0.5,
	});

	const [searchAutoRefresh, setSearchAutoRefresh] = useState<boolean>(false);

	const [searchFormError, setSearchFormError] = useState<string | null>(null);
	const searchForm = useForm<SearchFormValue>({
		initialValues: {
			..._.omit(searchParams, ["listType"]),
		},
		validate: {
			limit: (value: number) => {
				return value < 500 ? null : t("search.form.limit.validation_error");
			},
			hybridEmbedder: (value: string, values) => {
				return values.enableHybrid
					? value.length > 0
						? null
						: t("search.form.hybrid.embedder_required")
					: null;
			},
		},
	});

	const indexPrimaryKeyQuery = useQuery({
		queryKey: ["indexPrimaryKey", host, indexClient?.uid],
		queryFn: async () => {
			return (await indexClient?.getRawInfo())?.primaryKey;
		},

		enabled: !!currentIndex,
	});

	// use debounced values as dependencies for the search refresh
	const debouncedSearchFormValue = useDebounce(searchForm.values, {
		wait: 450,
	});
	const [listType, setListType] = useState<ListType>(searchParams.listType);

	useEffect(() => {
		// update search params when form values changed
		navigate({
			search: () => ({
				...debouncedSearchFormValue,
				listType,
			}),
		});
	}, [navigate, listType, debouncedSearchFormValue]);

	const searchDocumentsQuery = useQuery({
		queryKey: ["searchDocuments", host, indexClient?.uid],
		refetchInterval: searchAutoRefresh ? 7000 : false,
		refetchOnMount: searchAutoRefresh,
		refetchOnWindowFocus: searchAutoRefresh,
		refetchOnReconnect: searchAutoRefresh,
		queryFn: async () => {
			const {
				q,
				limit,
				offset,
				filter,
				sort = "",
				showRankingScore,
				enableHybrid,
				hybridEmbedder,
				hybridSemanticRatio,
			} = {
				...searchForm.values,
				...(debouncedSearchFormValue as typeof searchForm.values),
			};
			// prevent app error from request param invalid
			if (searchForm.validate().hasErrors) return emptySearchResult;

			// search sorting expression
			const sortExpressions: string[] =
				(sort.match(
					/(([\w\.]+)|(_geoPoint\([\d\.,\s]+\))){1}\:((asc)|(desc))/g,
				) as string[]) || [];

			console.debug("search sorting expression", sort, sortExpressions);

			try {
				const data = await indexClient!.search(q, {
					limit,
					offset,
					filter,
					sort: sortExpressions.map((v) => v.trim()),
					showRankingScore,
					hybrid: enableHybrid
						? {
								embedder: hybridEmbedder,
								semanticRatio: hybridSemanticRatio,
							}
						: undefined,
				});
				// clear error message if results are running normally
				setSearchFormError(null);
				return data || emptySearchResult;
			} catch (err) {
				const msg = (err as Error).message;
				setSearchFormError(null);
				if (msg.match(/filter/i)) {
					searchForm.setFieldError("filter", msg);
				} else if (msg.match(/sort/i)) {
					searchForm.setFieldError("sort", msg);
				} else {
					setSearchFormError(msg);
				}
				return emptySearchResult;
			}
		},

		enabled: !!currentIndex,
	});

	const onSearchSubmit = useCallback(async () => {
		await searchDocumentsQuery.refetch();
	}, [searchDocumentsQuery]);

	// use this to refresh search when typing, DO NOT use useQuery dependencies (will cause unknown rerender error).
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		searchAutoRefresh && searchDocumentsQuery.refetch();
		// prevent infinite recursion rerender.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearchFormValue]);

	return useMemo(
		() => (
			<div className={"h-full flex flex-col p-4 gap-4 overflow-hidden"}>
				<SearchBar
					isLoading={searchDocumentsQuery.isFetching}
					onAutoRefreshChange={setSearchAutoRefresh}
					searchForm={searchForm}
					searchFormError={searchFormError}
					onSearchSubmit={onSearchSubmit}
				/>
				<div className="h-px w-full bg-neutral-200 scale-x-150" />
				<Result
					initialListType={searchParams.listType}
					totalHits={searchDocumentsQuery.data?.estimatedTotalHits || 0}
					processingTimeMs={searchDocumentsQuery.data?.processingTimeMs || 0}
					list={searchDocumentsQuery.data?.hits || []}
					isLoading={searchDocumentsQuery.isFetching}
					onListTypeChange={setListType}
					refetchDocs={searchDocumentsQuery.refetch}
					currentIndex={currentIndex.index}
					indexPrimaryKey={indexPrimaryKeyQuery.data!}
				/>
			</div>
		),
		[
			searchDocumentsQuery.isFetching,
			searchDocumentsQuery.data?.estimatedTotalHits,
			searchDocumentsQuery.data?.processingTimeMs,
			searchDocumentsQuery.data?.hits,
			searchDocumentsQuery.refetch,
			searchForm,
			searchFormError,
			onSearchSubmit,
			currentIndex,
			indexPrimaryKeyQuery.data,
			searchParams.listType,
		],
	);
};

export const Route = createFileRoute(
	"/ins/$insID/_layout/index/$indexUID/_layout/documents/",
)({
	component: Page,
	pendingComponent: LoaderPage,
	validateSearch: searchPageParamsSchema,
});
