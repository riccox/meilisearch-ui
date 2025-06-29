import { cn } from "@/lib/cn";
import type { FC } from "react";
import { lineSpinner } from "ldrs";

lineSpinner.register();

type Props = {
	className?: string;
	size?: "sm" | "md" | "lg";
};

declare module "react" {
	namespace JSX {
		interface IntrinsicElements {
			"l-line-spinner": {
				size?: string | number;
				color?: string | number;
				speed?: string | number;
				stroke?: string | number;
				className?: string;
			};
		}
	}
}

export const Loader: FC<Props> = ({ className, size = "md" }) => {
	return (
		<l-line-spinner
			className={className}
			size={size === "sm" ? "16" : size === "md" ? "42" : "60"}
			stroke={size === "sm" ? "1" : size === "md" ? "4" : "6"}
			speed="1"
			color="#121212"
		/>
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
