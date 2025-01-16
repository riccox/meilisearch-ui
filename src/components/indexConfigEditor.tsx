import { useCurrentIndex } from "@/hooks/useCurrentIndex";
import { useMeiliClient } from "@/hooks/useMeiliClient";
import { cn } from "@/lib/cn";
import { hiddenRequestLoader, showRequestLoader } from "@/utils/loader";
import { showTaskSubmitNotification } from "@/utils/text";
import MonacoEditor from "@monaco-editor/react";
import { Button } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Settings } from "meilisearch";
import {
	type FC,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useTranslation } from "react-i18next";

export const IndexConfigEditor: FC<{
	className?: string;
}> = ({ className }) => {
	const { t } = useTranslation("index");
	const client = useMeiliClient();
	const currentIndex = useCurrentIndex(client);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const editorRef = useRef<any>(null);
	const [isSettingsEditing, setIsSettingsEditing] = useState<boolean>(false);

	const onClickEditSettings = useCallback(() => {
		setIsSettingsEditing(true);
	}, []);

	const [indexSettingDisplayData, setIndexSettingDisplayData] =
		useState<Settings>({});
	const [indexSettingInputData, setIndexSettingInputData] = useState<Settings>(
		indexSettingDisplayData,
	);

	const resetSettings = useCallback(
		(data: Settings = {}) => {
			setIsSettingsEditing(false);
			setIndexSettingDisplayData(data);
			if (!isSettingsEditing) {
				setIndexSettingInputData(data);
				editorRef.current?.setValue(JSON.stringify(data, null, 2));
			}
		},
		[isSettingsEditing],
	);

	const querySettings = useQuery({
		queryKey: ["settings", client.config.host, currentIndex.index.uid],
		queryFn: async () => {
			showRequestLoader();
			return await currentIndex.index.getSettings();
		},
	});

	useEffect(() => {
		if (querySettings.isSuccess) {
			// change display data when not editing
			!isSettingsEditing && resetSettings(querySettings.data);
		}
		if (!querySettings.isFetching) {
			hiddenRequestLoader();
		}
	}, [
		isSettingsEditing,
		querySettings.data,
		querySettings.isFetching,
		querySettings.isSuccess,
		resetSettings,
	]);

	const onSettingJsonEditorUpdate = useCallback(
		(value?: string) =>
			value && setIndexSettingInputData(JSON.parse(value) as Settings),
		[],
	);

	const settingsMutation = useMutation({
		mutationFn: async (variables: Settings) => {
			showRequestLoader();
			return await currentIndex.index.updateSettings(variables);
		},

		onSuccess: (t) => {
			showTaskSubmitNotification(t);
			setTimeout(() => querySettings.refetch(), 450);
		},
		onSettled: () => {
			hiddenRequestLoader();
		},
	});

	const onSaveSettings = useCallback(() => {
		setIsSettingsEditing(false);
		indexSettingInputData && settingsMutation.mutate(indexSettingInputData);
	}, [indexSettingInputData, settingsMutation]);

	const isLoading = useMemo(() => {
		return (
			querySettings.isLoading ||
			querySettings.isFetching ||
			settingsMutation.isPending
		);
	}, [
		querySettings.isFetching,
		querySettings.isLoading,
		settingsMutation.isPending,
	]);

	return useMemo(
		() => (
			<div className={cn(className, "p-1")}>
				<div className={"flex items-center gap-4 w-full pb-2"}>
					<div
						className={"text-xl font-medium mr-auto flex items-center gap-2"}
					>
						<p>JSON {t("setting.index.config.label")}</p>
						<a
							href="https://www.meilisearch.com/docs/reference/api/settings"
							target={"_blank"}
							rel="noreferrer"
						>
							<div className="i-lucide:circle-help w-1em h-1em text-neutral-400" />
						</a>
					</div>
					{!isSettingsEditing && (
						<Button
							variant="flat"
							size="sm"
							color="primary"
							onClick={() => {
								onClickEditSettings();
							}}
							isLoading={isLoading}
						>
							{t("edit")}
						</Button>
					)}
					{isSettingsEditing && (
						<Button
							variant="flat"
							size="sm"
							color="success"
							onClick={() => {
								onSaveSettings();
							}}
							isLoading={isLoading}
						>
							{t("save")}
						</Button>
					)}
					{isSettingsEditing && (
						<Button
							variant="flat"
							size="sm"
							color="default"
							onClick={() => {
								resetSettings();
							}}
						>
							{t("cancel")}
						</Button>
					)}
				</div>
				<MonacoEditor
					language="json"
					className={cn("h-[70vh]", !isSettingsEditing && "opacity-50")}
					defaultValue={JSON.stringify(indexSettingDisplayData, null, 2)}
					options={{
						automaticLayout: true,
						lineDecorationsWidth: 1,
						readOnly: !isSettingsEditing,
					}}
					onChange={onSettingJsonEditorUpdate}
					onMount={(ed) => {
						editorRef.current = ed;
					}}
				/>
			</div>
		),
		[
			className,
			t,
			isSettingsEditing,
			isLoading,
			indexSettingDisplayData,
			onSettingJsonEditorUpdate,
			onClickEditSettings,
			onSaveSettings,
			resetSettings,
		],
	);
};
