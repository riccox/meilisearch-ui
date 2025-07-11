"use client";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/store";
import dayjs from "dayjs";
import _ from "lodash";
import { type FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
	type SUPPORTED_LANGUAGE,
	SUPPORTED_LANGUAGE_LOCALIZED,
	locale2DayjsLocale,
} from "@/lib/i18n";
import "dayjs/locale/zh-cn";

interface Props {
	className?: string;
}

export const LangSelector: FC<Props> = ({ className = "" }) => {
	const { i18n } = useTranslation();
	const { language, setLanguage } = useAppStore();

	useEffect(() => {
		dayjs.locale(locale2DayjsLocale(language));
	}, [language]);

	return (
		<select
			value={language}
			className={cn(className, "w-fit outline-none bg-transparent")}
			onChange={(ev) => {
				const l = ev.target.value as SUPPORTED_LANGUAGE;
				i18n.changeLanguage(l);
				setLanguage(l);
			}}
		>
			{_.entries(SUPPORTED_LANGUAGE_LOCALIZED).map(([k, v]) => (
				<option value={k} key={v}>
					{v}
				</option>
			))}
		</select>
	);
};
