import assert from "node:assert/strict";
import { aggregateListings } from "./marketplace_aggregate.js";

const result = aggregateListings({
  buyerId: "b-1",
  listings: [
    { source: "one", sellerId: "s-1", title: "A", price: 10, currency: "USD", assetTags: ["video"] },
    { source: "two", sellerId: "s-1", title: "B", price: 15, currency: "USD", assetTags: ["quiz"] },
    { source: "two", sellerId: "s-2", title: "C", price: 8, currency: "USD", assetTags: [] }
  ]
});

assert.deepEqual(result.sellerAssets["s-1"], ["video", "quiz"]);
assert.equal(result.orderHandoff[0].total, 25);
assert.equal(result.buyerUpdate, "3 listings from 2 sources are ready for review.");
console.log("aggregation decision test passed");
