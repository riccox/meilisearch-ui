import { JsonEditor } from "@/components/JsonEditor";
import { LoaderPage } from "@/components/loader";
import { useCurrentIndex } from "@/hooks/useCurrentIndex";
import { useCurrentInstance } from "@/hooks/useCurrentInstance";
import { useMeiliClient } from "@/hooks/useMeiliClient";
import { cn } from "@/lib/cn";
import { hiddenRequestLoader, showRequestLoader } from "@/utils/loader";
import {
	showTaskErrorNotification,
	showTaskSubmitNotification,
} from "@/utils/text";
import { toast } from "@/utils/toast";
import { Tooltip } from "@arco-design/web-react";
import { Tag } from "@douyinfe/semi-ui";
import { useForm } from "@mantine/form";
import { Button } from "@nextui-org/react";
import { IconCopy } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import _ from "lodash";
import type { EnqueuedTask } from "meilisearch";
import { type DragEventHandler, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const UploadDoc = () => {
	const { t } = useTranslation("upload");

	const [dragAreaState, setDragAreaState] = useState<
		"leave" | "over" | "uploading"
	>("leave");
	const currentInstance = useCurrentInstance();
	const client = useMeiliClient();
	const currentIndex = useCurrentIndex(client);

	const host = currentInstance?.host;
	const apiKey = currentInstance?.apiKey;

	const addDocumentsForm = useForm<{
		editorContent: string;
	}>({
		initialValues: {
			editorContent: "[]",
		},
		validate: {
			editorContent: (value: string) => {
				try {
					if (JSON.parse(value).length !== 0) {
						return null;
					}
				} catch (e) {
					// is not a valid json, so we need to throw a tip.
					return t("invalid_json_string");
				}
			},
		},
	});

	const addDocumentsMutation = useMutation({
		mutationFn: async (variables: string | File) => {
			const url = new URL(`/indexes/${currentIndex.index.uid}/documents`, host);
			console.debug("addDocumentsMutation", {
				url,
				variables,
			});
			const response = await fetch(url, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: apiKey ? `Bearer ${apiKey}` : "",
				},
				body: variables,
			});
			const task = (await response.json()) as EnqueuedTask;
			console.debug("addDocumentsMutation", "response", task);
			return task;
		},

		onSuccess: (t) => {
			showTaskSubmitNotification(t);
			addDocumentsForm.reset();
		},
		onError: (error) => {
			console.error(error);
			showTaskErrorNotification(error);
		},
		onMutate() {
			if (dragAreaState !== "uploading") {
				setDragAreaState("uploading");
				showRequestLoader();
			}
		},
		onSettled() {
			if (dragAreaState === "uploading") {
				setDragAreaState("leave");
			}
			hiddenRequestLoader();
		},
	});

	// only read at first render time, so we don't need to use "useCallback"
	const pasteClipboardJSON = useCallback(async () => {
		// read clipboard and set default val if clipboard value match rules
		const [firstContent] = await navigator.clipboard.read();
		if (firstContent.types.includes("text/plain")) {
			const json = JSON.parse(
				await (await firstContent.getType("text/plain")).text(),
			);
			const arr = _.isArray(json) ? json : _.isObject(json) ? [json] : [];
			console.debug("onAddDocumentsByEditorClick paste clipboard", arr, json);
			if (arr.length > 0) {
				addDocumentsForm.setFieldValue(
					"editorContent",
					JSON.stringify(arr, null, 2),
				);
				toast.success(t("clipboard_json_pasted"));
			}
		}
	}, [t, addDocumentsForm]);

	const onEditorSubmit = useCallback(async () => {
		addDocumentsMutation.mutate(addDocumentsForm.values.editorContent);
	}, [addDocumentsMutation, addDocumentsForm]);
	const onFileSubmit = useCallback(
		async (file: File) => {
			if (!file || !(file.size > 0)) {
				toast.error(t("documents_json_array_requirement"));
				return;
			}
			addDocumentsMutation.mutate(file);
		},
		[addDocumentsMutation, t],
	);

	const onImportAreaClick = useCallback(async () => {
		if (dragAreaState === "uploading") return;
		const fileElem = document.getElementById("documents-json-file-selector");
		if (fileElem) {
			const handleFileChange = async (ev: Event) => {
				const input = ev.target as HTMLInputElement;
				const jsonFile = input.files?.[0];
				if (!jsonFile) return;

				console.debug("onImportAreaClick", "file-change", jsonFile);
				await onFileSubmit(jsonFile);
				// reset input value to trigger change event again
				input.value = "";
			};

			// remove old event listener to prevent multiple calls
			const input = fileElem as HTMLInputElement;
			input.removeEventListener("change", handleFileChange);
			// add new event listener
			input.addEventListener("change", handleFileChange);

			input.click();
		}
	}, [dragAreaState, onFileSubmit]);

	const onImportAreaDrop: DragEventHandler<HTMLDivElement> = useCallback(
		async (ev) => {
			ev.preventDefault();
			if (dragAreaState === "uploading") return;
			const jsonFile = ev.dataTransfer.files[0] as File;
			console.debug("onImportAreaDrop", "drop", jsonFile);
			await onFileSubmit(jsonFile);
		},
		[dragAreaState, onFileSubmit],
	);

	return useMemo(
		() => (
			<div
				className={`overflow-hidden fill 
        flex flex-col items-stretch rounded-3xl gap-4`}
			>
				<div className={"flex-1 flex gap-4 p-4 overflow-hidden"}>
					<div className={"flex-1 flex flex-col gap-4 max-w-1/2"}>
						<div className="flex items-center gap-2">
							<span>{t("input_by_editor")}</span>
							<Tag size="small">{t("manually_type_in")}</Tag>
							<Tooltip
								content={t(
									"click_to_paste_clipboard_content_if_it_is_valid_json",
								)}
								position="bottom"
							>
								<IconCopy
									className="cursor-pointer"
									size={"1em"}
									onClick={() => pasteClipboardJSON()}
								/>
							</Tooltip>
						</div>
						{addDocumentsForm.errors.editorContent && (
							<p className="text-red-500 text-sm">
								{addDocumentsForm.errors.editorContent}
							</p>
						)}
						<form
							className={"flex-1 flex flex-col gap-y-4 w-full overflow-hidden"}
							onSubmit={addDocumentsForm.onSubmit(onEditorSubmit)}
						>
							<div className={"border rounded-xl p-2 w-full overflow-scroll"}>
								<JsonEditor
									className="h-[32rem] w-full"
									value={addDocumentsForm.values.editorContent}
									onChange={(value) => {
										addDocumentsForm.setFieldValue("editorContent", value);
										addDocumentsForm.validate();
									}}
								/>
							</div>
							<Button type="submit" color="success">
								{t("submit")}
							</Button>
						</form>
					</div>
					<div className="flex-1 flex flex-col gap-y-4">
						<div className={"only-one-line flex items-center"}>
							<span className="pr-2">{t("import_json_file")}</span>
							<Tag size="small">{t("for_large_documents")}</Tag>
						</div>
						<div
							className={cn(
								"flex-1 flex flex-col justify-center items-center gap-4",
								"rounded-2xl !border-4 border-dashed  border-neutral-500",
								"transition-colors duration-500",
								"drag-json-file-area",
								dragAreaState !== "uploading"
									? "cursor-pointer"
									: "cursor-not-allowed",
								{
									"border-green-600": dragAreaState === "over",
									"border-rose-600": dragAreaState === "uploading",
								},
							)}
							onClick={() => onImportAreaClick()}
							onDrop={onImportAreaDrop}
							onDragOver={(ev) => {
								ev.preventDefault();
								setDragAreaState("over");
							}}
							onDragLeave={(ev) => {
								ev.preventDefault();
								setDragAreaState("leave");
							}}
						>
							<h6 className="text-2xl">
								{dragAreaState === "over" ? (
									<>{t("release_to_upload_documents")}</>
								) : dragAreaState === "uploading" ? (
									<>{t("uploading")}...</>
								) : (
									<span
										dangerouslySetInnerHTML={{
											__html: t("drag_and_drop_a_file_here", {
												type: '<strong class="underline">JSON</strong>',
											}),
										}}
									/>
								)}
							</h6>
							<span>{t("or")}</span>
							<Button
								variant="bordered"
								color={
									dragAreaState === "over"
										? "success"
										: dragAreaState === "uploading"
											? "danger"
											: "default"
								}
								disabled={dragAreaState === "uploading"}
								onClick={() => onImportAreaClick()}
							>
								{t("browse_file")}
							</Button>
							<input
								type="file"
								id="documents-json-file-selector"
								accept=".json"
								className="hidden"
								multiple={false}
								min={1}
								max={1}
							/>
						</div>
					</div>
				</div>
			</div>
		),
		[
			dragAreaState,
			onEditorSubmit,
			onImportAreaClick,
			onImportAreaDrop,
			pasteClipboardJSON,
			t,
			addDocumentsForm,
		],
	);
};

export const Route = createFileRoute(
	"/ins/$insID/_layout/index/$indexUID/_layout/documents/upload",
)({
	component: UploadDoc,
	pendingComponent: LoaderPage,
});
