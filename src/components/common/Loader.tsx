import { cn } from "@/lib/cn";
import type { FC } from "react";
import { lineSpinner } from "ldrs";

lineSpinner.register();

type Props = {
	className?: string;
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

export const Loader: FC<Props> = ({ className }) => {
	return (
		<l-line-spinner
			className={className}
			size="42"
			stroke="4"
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
