import { z } from "zod";

export const emptySearchResult = {
	hits: [],
	estimatedTotalHits: 0,
	processingTimeMs: 0,
};

export const searchPageParamsSchema = z
	.object({
		q: z.string(),
		limit: z.number().positive(),
		offset: z.number().nonnegative(),
		filter: z.string(),
		sort: z.string(),
		listType: z.enum(["json", "table", "grid"]),
		showRankingScore: z.coerce.boolean(),
		enableHybrid: z.boolean(),
		hybridEmbedder: z.string(),
		hybridSemanticRatio: z.number().min(0).max(1).default(0.5),
	})
	.partial();

export type SearchFormValue = Omit<
	Required<ReturnType<typeof searchPageParamsSchema.parse>>,
	"listType"
>;
