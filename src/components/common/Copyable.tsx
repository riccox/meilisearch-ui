"use client";
import { cn } from "@/lib/cn";
import { Typography } from "@arco-design/web-react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
interface Props {
	children: string;
	className?: string;
}

export const Copyable: FC<Props> = ({ className = "", children }) => {
	const { t } = useTranslation();

	return (
		<Typography.Paragraph
			className={cn("!mb-0", className)}
			copyable={{
				onCopy: () => {
					toast.success(t("common:copied"));
				},
				text: children,
			}}
		>
			{children}
		</Typography.Paragraph>
	);
};
