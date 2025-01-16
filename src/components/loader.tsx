import { cn } from "@/lib/cn";
import type { FC } from "react";
import cls from "../style/loader.module.css";

type Props = {
	className?: string;
};

export const Loader: FC<Props> = ({ className }) => {
	return (
		<div className={cn(cls.loader, className, "")}>
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
		</div>
	);
};

export const LoaderPage: FC<
	Props & {
		loaderCls?: string;
	}
> = ({ className, loaderCls }) => {
	return (
		<div
			className={cn(
				className,
				"w-full h-full flex-1 flex justify-center items-center",
			)}
		>
			<Loader className={loaderCls} />
		</div>
	);
};
