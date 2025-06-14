import type { FC, ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AppFallback } from "./fallback/AppFallback";
import type { ErrorFallbackProps } from "./fallback/AppFallback";

type ErrorBoundaryProps = {
	children: ReactNode;
	onReset?: () => void;
	FallbackComponent?: FC<ErrorFallbackProps>;
};

export const ReactErrorBoundary: FC<ErrorBoundaryProps> = ({
	children,
	onReset,
	FallbackComponent,
}) => {
	return (
		<ErrorBoundary
			FallbackComponent={FallbackComponent || AppFallback}
			onReset={onReset}
		>
			{children}
		</ErrorBoundary>
	);
};
