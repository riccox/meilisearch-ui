import { JsonEditor } from "@/components/common/JsonEditor";
import { toast } from "@/lib/toast";
import { Tag, Tooltip } from "@douyinfe/semi-ui";
import { useForm } from "@mantine/form";
import { Button } from "@nextui-org/react";
import { IconCopy } from "@tabler/icons-react";
import _ from "lodash";
import { forwardRef, useCallback, useImperativeHandle, useMemo } from "react";
import { useTranslation } from "react-i18next";

export const JsonEditorUpload = forwardRef(
	({ onSubmit }: { onSubmit: (content: string) => void }, ref) => {
		const { t } = useTranslation("upload");

		useImperativeHandle(ref, () => ({
			onSuccess: () => {
				addDocumentsForm.reset();
			},
		}));

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
			onSubmit(addDocumentsForm.values.editorContent);
		}, [addDocumentsForm, onSubmit]);

		return useMemo(
			() => (
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
			),
			[t, addDocumentsForm, onEditorSubmit, pasteClipboardJSON],
		);
	},
);
