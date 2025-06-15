import { LoaderPage } from "@/components/common/Loader";
import { createFileRoute } from "@tanstack/react-router";
import { UploadDoc } from "@/components/block/document/upload";

export const Route = createFileRoute(
	"/ins/$insID/_layout/index/$indexUID/_layout/documents/upload",
)({
	component: UploadDoc,
	pendingComponent: LoaderPage,
});
