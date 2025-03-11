import { useCurrentInstance } from "@/hooks/useCurrentInstance";
import { useMeiliClient } from "@/hooks/useMeiliClient";
import {
	isValidJSON,
	showTaskErrorNotification,
	showTaskSubmitNotification,
	stringifyJsonPretty,
} from "@/utils/text";
import { getTimeText, isValidDateTime, isValidImgUrl } from "@/utils/text";
import { toast } from "@/utils/toast";
import { Table, type TableProps } from "@arco-design/web-react";
import { Button } from "@arco-design/web-react";
import { Image, Radio, RadioGroup, Modal } from "@douyinfe/semi-ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import _ from "lodash";
import type { Index } from "meilisearch";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Copyable } from "../Copyable";
import { AttrTags } from "./AttrTags";
import { GridItem } from "./GridItem";
import { JSONItem } from "./JSONItem";
import { JsonEditor } from "../JsonEditor";
import { MdOutlineRawOn } from "react-icons/md";
import { BsStars } from "react-icons/bs";

export type Doc = {
	indexId: string;
	content: Record<string, unknown>;
	primaryKey: string;
};
export type BaseDocItemProps = {
	doc: Doc;
	onClickDocumentUpdate: (doc: Doc) => void;
	onClickDocumentDel: (doc: Doc) => void;
};
export type ListType = "json" | "table" | "grid";

// used in Modal to display the detailed value of a document field
const ValueContent = ({ str }: { str: string }) => {
	const [prettify, setIsPrettify] = useState(false);

	const isImg = isValidImgUrl(str);

	const isDateTime = isValidDateTime(str);

	const isJSON = isValidJSON(str);

	const canBePrettify = isImg || isDateTime || isJSON;

	return (
		<div className="grid gap-2">
			<div className="w-full flex justify-end">
				<RadioGroup
					type="button"
					defaultValue={1}
					disabled={!canBePrettify}
					onChange={(ev) => setIsPrettify(ev.target.value === 2)}
				>
					<Radio value={1}>
						<MdOutlineRawOn className="text-md scale-150" />
					</Radio>
					<Radio value={2}>
						<BsStars className="text-md" />
					</Radio>
				</RadioGroup>
			</div>
			{prettify ? (
				isImg ? (
					<Image width={"100%"} src={str} />
				) : isDateTime ? (
					<Copyable className="overflow-scroll whitespace-pre-wrap text-balance break-words">
						{getTimeText(isValidDateTime(str) as Date)}
					</Copyable>
				) : isJSON ? (
					<JsonEditor
						lineNumbers={false}
						className="max-h-[65vh] flex-1 overflow-scroll"
						defaultValue={JSON.stringify(JSON.parse(str), null, 2)}
						readonly
						onChange={() => {}}
					/>
				) : (
					<Copyable className="overflow-scroll whitespace-pre-wrap text-balance break-words">
						{str}
					</Copyable>
				)
			) : (
				<Copyable className="overflow-scroll whitespace-pre-wrap text-balance break-words">
					{str}
				</Copyable>
			)}
		</div>
	);
};

export const ValueDisplay = ({
	name,
	value,
	dateParser = true,
}: {
	name: string;
	value: unknown;
	dateParser?: boolean;
}) => {
	let str = _.toString(value).trim();

	if (_.isObjectLike(value)) {
		str = stringifyJsonPretty(value as object);
	}

	return (
		<div
			className="cursor-pointer"
			onClick={() => {
				Modal.info({
					title: name,
					centered: true,
					size: "large",
					content: <ValueContent str={str} />,
					// use a empty div as footer to hide the default btn footer and maintain the padding height for the content
					footer: <div />,
				});
			}}
		>
			{dateParser &&
			/^.*(date|time).*$/gim.test(name) &&
			isValidDateTime(str) ? (
				getTimeText(isValidDateTime(str) as Date)
			) : isValidImgUrl(str) ? (
				<Image width={"100%"} src={str} preview={false} />
			) : (
				_.truncate(str, { length: 20 })
			)}
		</div>
	);
};

interface Props {
	currentIndex: Index;
	type?: ListType;
	docs?: Doc[];
	refetchDocs: () => void;
}

export const DocumentList = ({
	docs = [],
	type = "json",
	currentIndex,
}: Props) => {
	const { t } = useTranslation("document");
	const client = useMeiliClient();
	const [editingDocument, setEditingDocument] = useState<Doc>();
	const [updateDocEditorData, setUpdateDocEditorData] = useState<string>();
	const [editingDocModalVisible, setEditingDocModalVisible] =
		useState<boolean>(false);
	const currentInstance = useCurrentInstance();

	const indexSettingsQuery = useQuery({
		queryKey: ["indexSettings", currentInstance.host, currentIndex.uid],
		queryFn: async () => {
			return await currentIndex.getSettings();
		},
	});

	const indexSettings = useMemo(() => {
		return indexSettingsQuery.data;
	}, [indexSettingsQuery.data]);

	const editDocumentMutation = useMutation({
		mutationFn: async ({ docs }: { docs: object[] }) => {
			return await currentIndex.updateDocuments(docs);
		},
		onSuccess: (t) => {
			showTaskSubmitNotification(t);
		},
		onError: (error) => {
			console.error(error);
			showTaskErrorNotification(error);
		},
	});

	const removeDocumentsMutation = useMutation({
		mutationFn: async ({
			indexId,
			docId,
		}: {
			indexId: string;
			docId: string[] | number[];
		}) => {
			return await client.index(indexId).deleteDocuments(docId);
		},
		onSuccess: (t) => {
			showTaskSubmitNotification(t);
		},
		onError: (error: Error) => {
			console.error(error);
			showTaskErrorNotification(error);
		},
	});

	const onClickDocumentDel = useCallback(
		(doc: Doc) => {
			const pk = doc.primaryKey;
			console.debug("onClickDocumentDel", "pk", pk);
			if (pk) {
				Modal.confirm({
					title: t("delete_document"),
					content: (
						<p
							dangerouslySetInnerHTML={{
								__html: t("delete.tip", {
									indexId: doc.indexId,
									// @ts-ignore
									primaryKey: doc.content[pk],
								}),
							}}
						/>
					),
					okText: t("confirm"),
					cancelText: t("cancel"),
					onOk: () => {
						removeDocumentsMutation.mutate({
							indexId: doc.indexId,
							// @ts-ignore
							docId: [doc.content[pk]],
						});
					},
				});
			} else {
				toast.error(t("delete.require_primaryKey", { indexId: doc.indexId }));
			}
		},
		[removeDocumentsMutation, t],
	);

	const onEditDocumentJsonEditorUpdate = useCallback(
		(value = "[]") => setUpdateDocEditorData(value),
		[],
	);

	const onClickDocumentUpdate = useCallback((doc: Doc) => {
		const pk = doc.primaryKey;
		console.debug("onClickDocumentUpdate", "pk", pk);
		console.debug("onClickDocumentUpdate", "doc", doc.content);
		if (pk) {
			setEditingDocument(doc);
			setEditingDocModalVisible(true);
		}
	}, []);

	return useMemo(
		() => (
			<>
				<Modal
					// destroy DOM after close, otherwise the JSON editor will remain previously edited content
					// unmountOnExit
					visible={editingDocModalVisible}
					confirmLoading={editDocumentMutation.isPending}
					title={t("edit_document")}
					okText={t("submit")}
					cancelText={t("cancel")}
					simple={false}
					className="!w-1/2"
					onOk={() => {
						console.debug(
							"submit doc update",
							editingDocument,
							updateDocEditorData,
						);
						if (editingDocument && updateDocEditorData) {
							editDocumentMutation
								.mutateAsync({
									docs: [JSON.parse(updateDocEditorData)],
								})
								.then(() => {
									setEditingDocModalVisible(false);
								});
						}
					}}
					onCancel={() => setEditingDocModalVisible(false)}
				>
					<div className={"border rounded-xl p-2"}>
						<JsonEditor
							className="h-80"
							defaultValue={
								editingDocument?.content
									? JSON.stringify(editingDocument.content, null, 2)
									: "{}"
							}
							onChange={onEditDocumentJsonEditorUpdate}
						/>
					</div>
				</Modal>
				{type === "table" ? (
					<div>
						<Table
							columns={(
								[
									...new Set(
										docs.reduce(
											(keys, obj) => {
												return keys.concat(Object.keys(obj.content));
											},
											[docs[0].primaryKey],
										),
									),
								].map((i) => ({
									title: (
										<div className="flex items-center gap-1">
											<p>{i}</p>
											{indexSettings && (
												<AttrTags attr={i} indexSettings={indexSettings} />
											)}
										</div>
									),
									dataIndex: i,
									width: "15rem",
									ellipsis: true,
									render(_col, item) {
										return (
											<ValueDisplay
												name={i}
												value={item[i]}
												dateParser={false}
											/>
										);
									},
								})) as TableProps["columns"]
							)?.concat([
								{
									title: t("common:actions"),
									fixed: "right",
									align: "center",
									width: "8rem",
									render: (_col, _record, index) => (
										<div className={"flex items-center gap-2"}>
											<Button
												type="secondary"
												size="mini"
												status="warning"
												onClick={() => onClickDocumentUpdate(docs[index])}
											>
												{t("common:update")}
											</Button>
											<Button
												type="secondary"
												size="mini"
												status="danger"
												onClick={() => onClickDocumentDel(docs[index])}
											>
												{t("common:delete")}
											</Button>
										</div>
									),
								},
							])}
							data={docs.map((d) => ({ ...d.content }))}
							stripe
							hover
							virtualized
							pagination={false}
							size="small"
							scroll={{ x: true }}
						/>
					</div>
				) : type === "grid" ? (
					<div className="grid grid-cols-3 laptop:grid-cols-4 gap-3">
						{docs.map((d, i) => {
							return (
								<GridItem
									doc={d}
									key={i}
									indexSettings={indexSettings}
									onClickDocumentDel={onClickDocumentDel}
									onClickDocumentUpdate={onClickDocumentUpdate}
								/>
							);
						})}
					</div>
				) : (
					<>
						{docs.map((d, i) => {
							return (
								<JSONItem
									doc={d}
									key={i}
									onClickDocumentDel={onClickDocumentDel}
									onClickDocumentUpdate={onClickDocumentUpdate}
								/>
							);
						})}
					</>
				)}
			</>
		),
		[
			docs,
			editDocumentMutation,
			editingDocModalVisible,
			editingDocument,
			updateDocEditorData,
			indexSettings,
			onClickDocumentDel,
			onClickDocumentUpdate,
			onEditDocumentJsonEditorUpdate,
			t,
			type,
		],
	);
};
