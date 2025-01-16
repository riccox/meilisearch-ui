import { useCurrentInstance } from "@/hooks/useCurrentInstance";
import { useMeiliClient } from "@/hooks/useMeiliClient";
import {
	showTaskErrorNotification,
	showTaskSubmitNotification,
	stringifyJsonPretty,
} from "@/utils/text";
import { getTimeText, isValidDateTime, isValidImgUrl } from "@/utils/text";
import { toast } from "@/utils/toast";
import { Modal, Table, type TableProps } from "@arco-design/web-react";
import { Button } from "@arco-design/web-react";
import { Image } from "@douyinfe/semi-ui";
import MonacoEditor from "@monaco-editor/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import _ from "lodash";
import type { Index } from "meilisearch";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Copyable } from "../Copyable";
import { AttrTags } from "./AttrTags";
import { GridItem } from "./GridItem";
import { JSONItem } from "./JSONItem";

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
					content: (
						<div className="grid gap-2">
							<Copyable className="overflow-scroll whitespace-pre-wrap text-balance break-words">
								{str}
							</Copyable>
							{isValidImgUrl(str) && <Image width={"100%"} src={str} />}
						</div>
					),
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
		(value = "[]") =>
			setEditingDocument((prev) => ({ ...prev!, content: JSON.parse(value) })),
		[],
	);

	const onClickDocumentUpdate = useCallback((doc: Doc) => {
		const pk = doc.primaryKey;
		console.debug("onClickDocumentUpdate", "pk", pk);
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
					unmountOnExit
					visible={editingDocModalVisible}
					confirmLoading={editDocumentMutation.isPending}
					title={t("edit_document")}
					okText={t("submit")}
					cancelText={t("cancel")}
					simple={false}
					className="!w-1/2"
					onOk={() => {
						console.debug("submit doc update", editingDocument);
						if (editingDocument) {
							editDocumentMutation
								.mutateAsync({
									docs: [editingDocument.content],
								})
								.then(() => {
									setEditingDocModalVisible(false);
								});
						}
					}}
					onCancel={() => setEditingDocModalVisible(false)}
				>
					<div className={"border rounded-xl p-2"}>
						<MonacoEditor
							language="json"
							className="h-80"
							defaultValue={JSON.stringify(
								editingDocument?.content ?? {},
								null,
								2,
							)}
							options={{
								automaticLayout: true,
								lineDecorationsWidth: 1,
							}}
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
			indexSettings,
			onClickDocumentDel,
			onClickDocumentUpdate,
			onEditDocumentJsonEditorUpdate,
			t,
			type,
		],
	);
};
