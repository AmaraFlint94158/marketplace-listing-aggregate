import { aggregateListings, embedBuyerUpdate } from "./marketplace_aggregate.js";

const result = aggregateListings({
  buyerId: "buyer-42",
  listings: [
    { source: "course-market", sellerId: "seller-a", title: "Algebra Basics", price: 29, currency: "USD", assetTags: ["video", "worksheet"] },
    { source: "creator-shop", sellerId: "seller-a", title: "Exam Prep Pack", price: 19, currency: "USD", assetTags: ["worksheet"] },
    { source: "course-market", sellerId: "seller-b", title: "Physics Lab", price: 35, currency: "USD", assetTags: ["lab"] }
  ]
});

console.log(JSON.stringify(result, null, 2));
if (process.env.INFRAI_API_KEY) {
  const embedding = await embedBuyerUpdate(result.buyerUpdate);
  console.log(`buyer update embedding dimensions: ${embedding.length}`);
}
