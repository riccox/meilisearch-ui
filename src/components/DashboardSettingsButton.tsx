import { cn } from "@/lib/cn";
import { type Instance, useAppStore } from "@/store";
import { Modal } from "@arco-design/web-react";
import { Menu } from "@mantine/core";
import {
	IconFileExport,
	IconFileImport,
	IconSettings,
	IconTrash,
} from "@tabler/icons-react";
import { useCallback, useRef } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
	className?: string;
}

export const DashboardSettingsButton: FC<Props> = ({ className = "" }) => {
	const { t } = useTranslation("dashboard");
	const instances = useAppStore((state) => state.instances);
	const addInstance = useAppStore((state) => state.addInstance);
	const removeAllInstances = useAppStore((state) => state.removeAllInstances);
	const importInstancesFileInputRef = useRef<HTMLInputElement>(null);

	const onClickExportInstances = () => {
		if (instances.length > 0) {
			const jsonString = JSON.stringify(instances, null, 2);
			const blob = new Blob([jsonString], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "export-meilisearch-ui.json";

			document.body.appendChild(a);
			a.click();

			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}
	};

	const onClickImportInstances = () => {
		if (importInstancesFileInputRef.current) {
			importInstancesFileInputRef.current.click();
		}
	};

	const handleImportInstancesFileUpload = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const content = e.target?.result;
				if (content) {
					const parsed = JSON.parse(content as string);

					if (isValidInstanceArray(parsed)) {
						parsed.forEach((ins) => {
							const _ins = { ...ins, id: 0 };
							addInstance(ins);
						});
					}
				}
			} catch (err: any) {
			} finally {
				event.target.value = "";
			}
		};

		reader.readAsText(file);
	};

	const isValidInstanceArray = (data: any): data is Instance[] => {
		if (!Array.isArray(data)) return false;

		return data.every(
			(item) =>
				typeof item.id === "number" &&
				typeof item.name === "string" &&
				typeof item.host === "string" &&
				(item.apiKey === undefined || typeof item.apiKey === "string") &&
				(item.updatedTime === undefined ||
					!Number.isNaN(new Date(item.updatedTime).getTime())),
		);
	};

	const onClickRemoveAllInstances = useCallback(() => {
		Modal.confirm({
			title: t("settings.remove.title"),
			alignCenter: true,
			content: t("settings.remove.tip"),
			onOk: async () => {
				return removeAllInstances();
			},
			okText: t("confirm"),
			cancelText: t("cancel"),
		});
	}, [removeAllInstances, t]);

	return (
		<div className={cn("px-2", className)}>
			<input
				type="file"
				accept=".json"
				ref={importInstancesFileInputRef}
				style={{ display: "none" }}
				onChange={handleImportInstancesFileUpload}
				id="import-instances"
			/>
			<Menu shadow="md" width={200}>
				<Menu.Target>
					<IconSettings className={"text-white w-5 h-5 cursor-pointer"} />
				</Menu.Target>

				<Menu.Dropdown>
					<Menu.Item
						leftSection={<IconFileExport size={14} />}
						disabled={!(instances.length > 0)}
						onClick={onClickExportInstances}
					>
						{t("settings.export")}
					</Menu.Item>
					<Menu.Item
						leftSection={<IconFileImport size={14} />}
						onClick={onClickImportInstances}
					>
						{t("settings.import")}
					</Menu.Item>

					<Menu.Divider />

					<Menu.Label>{t("settings.danger_zone")}</Menu.Label>
					<Menu.Item
						leftSection={<IconTrash size={14} />}
						color="red"
						disabled={!(instances.length > 0)}
						onClick={onClickRemoveAllInstances}
					>
						{t("settings.remove.title")}
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</div>
	);
};
