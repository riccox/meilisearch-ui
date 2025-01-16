import { useCurrentIndex } from "@/hooks/useCurrentIndex";
import { useMeiliClient } from "@/hooks/useMeiliClient";
import { showTaskSubmitNotification } from "@/utils/text";
import { toast } from "@/utils/toast";
import { Input, Modal, Tooltip } from "@douyinfe/semi-ui";
import { useForm } from "@mantine/form";
import _ from "lodash";
import type { EnqueuedTask } from "meilisearch";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Copyable } from "./Copyable";

type Props = {
	afterMutation: () => void;
};

export const IndexPrimaryKey = ({ afterMutation }: Props) => {
	const { t } = useTranslation("index");
	const client = useMeiliClient();
	const currentIndex = useCurrentIndex(client);
	const form = useForm({
		initialValues: {
			primaryKey: currentIndex.index.primaryKey,
		},
	});

	const [visible, setVisible] = useState(false);

	const showDialog = () => {
		setVisible(true);
	};
	const closeDialog = () => {
		setVisible(false);
		form.reset();
	};

	const onSubmit = useCallback(
		async (values: typeof form.values) => {
			let task: EnqueuedTask;
			try {
				task = await currentIndex.index.update({
					primaryKey: values.primaryKey,
				});
				console.info(task);
				if (!_.isEmpty(task)) {
					showTaskSubmitNotification(task);
					afterMutation();
				}
			} catch (e) {
				console.warn(e);
				toast.error(t("toast.fail", { msg: e as string }));
			}
		},
		[afterMutation, currentIndex.index, t],
	);

	return (
		<>
			<div className="flex gap-1 items-center">
				{currentIndex.index.primaryKey ? (
					<Copyable>{currentIndex.index.primaryKey as string}</Copyable>
				) : (
					t("common:none")
				)}
				<div
					className="i-lucide:edit w-1em h-1em cursor-pointer hover:scale-90 transition"
					onClick={() => {
						showDialog();
					}}
				/>
			</div>
			<Modal
				centered
				footerFill
				visible={visible}
				title={t("update") + t("primaryKey")}
				okText={t("submit")}
				cancelText={t("common:cancel")}
				afterClose={() => {
					closeDialog();
				}}
				onOk={async () => {
					await onSubmit(form.values);
					closeDialog();
				}}
				onCancel={closeDialog}
			>
				<form className={"pt-3 space-y-3"}>
					<Tooltip
						position={"bottomLeft"}
						content={t("create_index.form.primaryKey.tip")}
					>
						<Input
							addonBefore={t("primaryKey")}
							{...form.getInputProps("primaryKey")}
						/>
					</Tooltip>
				</form>
			</Modal>
		</>
	);
};
