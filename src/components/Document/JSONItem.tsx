import { Button } from "@arco-design/web-react";
import { useTranslation } from "react-i18next";
import ReactJson from "react-json-view";
import type { BaseDocItemProps } from "./list";

export const JSONItem = ({
	doc,
	onClickDocumentDel,
	onClickDocumentUpdate,
}: BaseDocItemProps) => {
	const { t } = useTranslation("document");

	return (
		<div
			className={
				"text-xs rounded-xl p-4 bg-primary-50 odd:bg-opacity-20 even:bg-opacity-10 group relative"
			}
		>
			<ReactJson
				name={false}
				displayDataTypes={false}
				displayObjectSize={false}
				src={doc.content}
				collapsed={3}
				collapseStringsAfterLength={50}
			/>
			<div
				className={
					"absolute right-0 bottom-0 opacity-95 invisible group-hover:visible p-2 flex items-center gap-2"
				}
			>
				<Button
					type="secondary"
					size="mini"
					status="warning"
					onClick={() => onClickDocumentUpdate(doc)}
				>
					{t("common:update")}
				</Button>
				<Button
					type="secondary"
					size="mini"
					status="danger"
					onClick={() => onClickDocumentDel(doc)}
				>
					{t("common:delete")}
				</Button>
			</div>
		</div>
	);
};
