import { SearchForm } from "@/components/biz/document/SearchForm";
import { cn } from "@/lib/cn";
import type { UseFormReturnType } from "@mantine/form";
import { useMemo, type FC } from "react";
import { useTranslation } from "react-i18next";
import type { SearchFormValue } from ".";
import { useQuery } from "@tanstack/react-query";
import type { Index } from "meilisearch";
import { Skeleton } from "@douyinfe/semi-ui";

type Props = {
	isLoading: boolean;
	onAutoRefreshChange: (v: boolean) => void;
	searchForm: UseFormReturnType<
		SearchFormValue,
		(values: SearchFormValue) => SearchFormValue
	>;
	searchFormError: string | null;
	onSearchSubmit: () => void;
	currentIndex: Index;
	currentInstanceHost: string;
};

export const SearchBar: FC<Props> = ({
	isLoading,
	onAutoRefreshChange,
	searchForm,
	searchFormError,
	onSearchSubmit,
	currentIndex,
	currentInstanceHost,
}) => {
	const { t } = useTranslation("document");

	const indexSettingsQuery = useQuery({
		queryKey: ["indexSettings", currentInstanceHost, currentIndex.uid],
		queryFn: async () => {
			return await currentIndex.getSettings();
		},
	});

	const loading = useMemo(() => {
		return indexSettingsQuery.isLoading;
	}, [indexSettingsQuery.isLoading]);

	console.log(
		indexSettingsQuery.data?.embedders,
		Object.keys(indexSettingsQuery.data?.embedders ?? {}),
	);

	return (
		<Skeleton
			loading={loading}
			active
			style={{ width: "100%", height: "10rem" }}
			placeholder={<Skeleton.Image />}
		>
			<div className={cn("rounded-lg", isLoading && "rainbow-ring-rotate")}>
				<div className={"rounded-lg p-4 border"}>
					<SearchForm
						embedders={
							Object.keys(indexSettingsQuery.data?.embedders ?? {}) || []
						}
						onAutoRefreshChange={onAutoRefreshChange}
						isFetching={isLoading}
						searchForm={searchForm}
						searchFormError={searchFormError}
						onFormSubmit={searchForm.onSubmit(onSearchSubmit)}
						submitBtnText={t("common:search")}
					/>
				</div>
			</div>
		</Skeleton>
	);
};
