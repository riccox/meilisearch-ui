import { Copyright } from "@/components/Footer/Copyright";
import { cn } from "@/lib/cn";
import type { FC } from "react";
import { LangSelector } from "../lang";
import { Singleton } from "./Singleton";
import { Version } from "./Version";

interface Props {
	className?: string;
}

export const Footer: FC<Props> = ({ className = "" }) => {
	return (
		<div
			className={cn(
				"gap-4 flex justify-center items-center w-full text-neutral-400 text-xs",
				className,
			)}
		>
			<Copyright />
			<Version />
			<a
				className={"hover:underline"}
				href={"//github.com/riccox/meilisearch-ui"}
				target="_blank"
				rel="noreferrer"
			>
				Github
			</a>
			<LangSelector />
			<Singleton />
		</div>
	);
};
