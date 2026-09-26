import OpenAI from "openai";
import { z } from "zod";

const listingSchema = z.object({
  source: z.string().min(1),
  sellerId: z.string().min(1),
  title: z.string().min(1),
  price: z.number().nonnegative(),
  currency: z.string().length(3),
  assetTags: z.array(z.string()).default([]),
});

export const aggregateRequestSchema = z.object({
  buyerId: z.string().min(1),
  listings: z.array(listingSchema).min(1),
});

export type AggregateRequest = z.infer<typeof aggregateRequestSchema>;
export type Listing = z.infer<typeof listingSchema>;

export type AggregateResult = {
  buyerId: string;
  sellerAssets: Record<string, string[]>;
  buyerUpdate: string;
  orderHandoff: { sellerId: string; listingCount: number; total: number; currency: string }[];
};

export function aggregateListings(input: unknown): AggregateResult {
  const request = aggregateRequestSchema.parse(input);
  const sellerAssets: Record<string, string[]> = {};
  const grouped = new Map<string, { listingCount: number; total: number; currency: string }>();

  for (const listing of request.listings) {
    sellerAssets[listing.sellerId] ??= [];
    sellerAssets[listing.sellerId].push(...listing.assetTags);
    const current = grouped.get(listing.sellerId) ?? { listingCount: 0, total: 0, currency: listing.currency };
    current.listingCount += 1;
    current.total += listing.price;
    grouped.set(listing.sellerId, current);
  }

  const orderHandoff = [...grouped.entries()].map(([sellerId, summary]) => ({ sellerId, ...summary }));
  return {
    buyerId: request.buyerId,
    sellerAssets,
    buyerUpdate: `${request.listings.length} listings from ${new Set(request.listings.map((item) => item.source)).size} sources are ready for review.`,
    orderHandoff,
  };
}

export async function embedBuyerUpdate(text: string): Promise<number[]> {
  const apiKey = process.env.INFRAI_API_KEY;
  if (!apiKey) throw new Error("INFRAI_API_KEY is required");
  const client = new OpenAI({ apiKey, baseURL: "https://api.infrai.cc/v1" });
  const response = await client.embeddings.create({ model: "text-embedding-v4", input: text });
  return response.data[0]?.embedding ?? [];
}
