import { cn } from "@/lib/cn";
import { hiddenRequestLoader, showRequestLoader } from "@/lib/loader";
import { toast } from "@/lib/toast";
import { Tag } from "@douyinfe/semi-ui";
import { Button } from "@nextui-org/react";
import {
	type DragEventHandler,
	forwardRef,
	useCallback,
	useImperativeHandle,
	useMemo,
	useState,
} from "react";
import { useTranslation } from "react-i18next";

export const JsonFileUpload = forwardRef(
	({ onFile }: { onFile: (file: File) => void }, ref) => {
		const { t } = useTranslation("upload");

		const [dragAreaState, setDragAreaState] = useState<
			"leave" | "over" | "uploading"
		>("leave");

		useImperativeHandle(ref, () => ({
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
		}));

		const onFileSubmit = useCallback(
			async (file: File) => {
				if (!file || !(file.size > 0)) {
					toast.error(t("documents_json_array_requirement"));
					return;
				}
				onFile(file);
			},
			[onFile, t],
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
							onPress={() => onImportAreaClick()}
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
			),
			[dragAreaState, onImportAreaClick, onImportAreaDrop, t],
		);
	},
);
