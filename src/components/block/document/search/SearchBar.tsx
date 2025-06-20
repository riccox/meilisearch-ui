import { SearchForm } from "@/components/biz/document/SearchForm";
import { cn } from "@/lib/cn";
import type { UseFormReturnType } from "@mantine/form";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { SearchFormValue } from ".";

type Props = {
	isLoading: boolean;
	onAutoRefreshChange: (v: boolean) => void;
	searchForm: UseFormReturnType<
		SearchFormValue,
		(values: SearchFormValue) => SearchFormValue
	>;
	searchFormError: string | null;
	onSearchSubmit: () => void;
};

export const SearchBar: FC<Props> = ({
	isLoading,
	onAutoRefreshChange,
	searchForm,
	searchFormError,
	onSearchSubmit,
}) => {
	const { t } = useTranslation("document");

	return (
		<div className={cn("rounded-lg", isLoading && "rainbow-ring-rotate")}>
			<div className={"rounded-lg p-4 border"}>
				<SearchForm
					onAutoRefreshChange={onAutoRefreshChange}
					isFetching={isLoading}
					searchForm={searchForm}
					searchFormError={searchFormError}
					onFormSubmit={searchForm.onSubmit(onSearchSubmit)}
					submitBtnText={t("common:search")}
				/>
			</div>
		</div>
	);
};
