import { useCurrentIndex } from "@/hooks/useCurrentIndex";
import { useCurrentInstance } from "@/hooks/useCurrentInstance";
import { useMeiliClient } from "@/hooks/useMeiliClient";
import {
	showTaskSubmitNotification,
	showTaskErrorNotification,
} from "@/lib/toast";
import { useMutation } from "@tanstack/react-query";
import _ from "lodash";
import type { EnqueuedTask } from "meilisearch";
import { useMemo, useRef } from "react";
import { JsonFileUpload } from "./JsonFile";
import { JsonEditorUpload } from "./Editor";
import { hiddenRequestLoader } from "@/lib/loader";

export const UploadDoc = () => {
	const editorRef = useRef<{
		onSuccess: () => void;
	}>(null);
	const fileRef = useRef<{
		onMutate: () => void;
		onSettled: () => void;
	}>(null);

	const currentInstance = useCurrentInstance();
	const client = useMeiliClient();
	const currentIndex = useCurrentIndex(client);

	const host = currentInstance?.host;
	const apiKey = currentInstance?.apiKey;

	const addDocumentsMutation = useMutation({
		mutationFn: async (variables: string | File) => {
			const url = new URL(`/indexes/${currentIndex.index.uid}/documents`, host);
			console.debug("addDocumentsMutation", {
				url,
				variables,
			});
			const response = await fetch(url, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: apiKey ? `Bearer ${apiKey}` : "",
				},
				body: variables,
			});
			const task = (await response.json()) as EnqueuedTask;
			console.debug("addDocumentsMutation", "response", task);
			return task;
		},

		onSuccess: (t) => {
			showTaskSubmitNotification(t);
			editorRef.current?.onSuccess();
		},
		onError: (error) => {
			console.error(error);
			showTaskErrorNotification(error);
		},
		onMutate() {
			fileRef.current?.onMutate();
		},
		onSettled() {
			fileRef.current?.onSettled();
			hiddenRequestLoader();
		},
	});

	return useMemo(
		() => (
			<div
				className={`overflow-hidden fill 
        flex flex-col items-stretch rounded-3xl gap-4`}
			>
				<div className={"flex-1 flex gap-4 p-4 overflow-hidden"}>
					<JsonEditorUpload
						ref={editorRef}
						onSubmit={addDocumentsMutation.mutate}
					/>
					<JsonFileUpload ref={fileRef} onFile={addDocumentsMutation.mutate} />
				</div>
			</div>
		),
		[addDocumentsMutation.mutate],
	);
};
