import { Button } from "@arco-design/web-react";
import { Descriptions } from "@douyinfe/semi-ui";
import type { Settings } from "meilisearch";
import { useTranslation } from "react-i18next";
import { AttrTags } from "./AttrTags";
import { type BaseDocItemProps, ValueDisplay } from "./list";

export const GridItem = ({
	doc,
	onClickDocumentDel,
	onClickDocumentUpdate,
	indexSettings,
}: BaseDocItemProps & { indexSettings?: Settings }) => {
	const { t } = useTranslation("document");

	return (
		<div
			className={
				"rounded-xl px-3 py-5 bg-primary-50/20 border border-transparent hover:border-primary group relative overflow-hidden"
			}
		>
			<Descriptions
				align="center"
				data={Object.entries(doc.content).map(([k, v]) => ({
					key: (
						<div className="flex justify-end items-center gap-1">
							{indexSettings && (
								<AttrTags attr={k} indexSettings={indexSettings} />
							)}
							<p>{k}</p>
						</div>
					),
					value: <ValueDisplay name={k} value={v} />,
				}))}
			/>
			<div
				className={
					"absolute right-0 bottom-0 opacity-95 invisible group-hover:visible p-1.5 flex items-center gap-2"
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
