import theme from "@/style/theme.json";
import { type MantineColorsTuple, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import _ from "lodash";
import type { FC, ReactNode } from "react";
import "@mantine/core/styles.css";
import {
	type SUPPORTED_LANGUAGE,
	lang2ArcoLocale,
	lang2SemiLocale,
} from "@/utils/i18n";
import { ConfigProvider } from "@arco-design/web-react";
import { LocaleProvider } from "@douyinfe/semi-ui";
import { NextUIProvider } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

type Props = {
	children: ReactNode;
};

export const UIProvider: FC<Props> = ({ children }) => {
	const { i18n } = useTranslation();
	return (
		<LocaleProvider
			locale={lang2SemiLocale(i18n.resolvedLanguage as SUPPORTED_LANGUAGE)}
		>
			<ConfigProvider
				locale={lang2ArcoLocale(i18n.resolvedLanguage as SUPPORTED_LANGUAGE)}
			>
				<MantineProvider
					theme={{
						colors: _.transform(
							_.pick(theme.colors, ["primary", "secondary"]),
							(result, value, key) => {
								// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
								// biome-ignore lint/style/noParameterAssign: <explanation>
								result || (result = {});
								result[key] = Object.values(
									value,
								) as unknown as MantineColorsTuple;
							},
						),
						primaryColor: "primary",
					}}
				>
					<ModalsProvider
						modalProps={{
							centered: true,
							lockScroll: true,
							shadow: "xl",
							radius: "lg",
							padding: "xl",
							overlayProps: {
								opacity: 0.3,
							},
						}}
					>
						<NextUIProvider>{children}</NextUIProvider>
					</ModalsProvider>
				</MantineProvider>
			</ConfigProvider>
		</LocaleProvider>
	);
};
