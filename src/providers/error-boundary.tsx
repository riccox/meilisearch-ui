import type { FC, ReactNode } from "react";

import { ReactErrorBoundary } from "@/components/common/error-boundary";
import { AppFallback } from "@/components/common/error-boundary/fallback";

type Props = {
	children: ReactNode;
};

export const ErrorBoundaryProvider: FC<Props> = ({ children }) => {
	return (
		<ReactErrorBoundary FallbackComponent={AppFallback}>
			{children}
		</ReactErrorBoundary>
	);
};
