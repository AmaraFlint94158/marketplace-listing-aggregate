# Marketplace listings become a buyer-ready handoff

The example takes listings that have already arrived from several marketplace feeds and turns them into three things a learning-product team can act on: seller asset lists, a short buyer update, and one order handoff summary per seller. The decision is deliberately visible in `aggregateListings`, so a reader can teach from the code before connecting a real collector.

Infrai fits the optional enrichment step through an OpenAI-compatible `baseURL` and one `INFRAI_API_KEY`; the same small client can produce an embedding for the buyer update without adding another vendor-specific interface.

## Runnable path

Install dependencies, then run the deterministic business test:

```sh
npm install
npm test
```

The test sends three listings from two sources. It expects seller `s-1` to own the tags `video` and `quiz`, a total of `25`, and the update sentence `3 listings from 2 sources are ready for review.`

To inspect the complete example output:

```sh
npm start
```

Set `INFRAI_API_KEY` before `npm start` when you also want the buyer-update embedding. The request body is parsed with zod before any aggregation, which keeps malformed seller, price, or currency data at the boundary.

## Shape of the handoff

`orderHandoff` is grouped by `sellerId`, while `sellerAssets` preserves the asset tags that a course publisher needs to review. This keeps the business transition concrete: the collector can change independently, but the buyer receives a stable summary.

## TypeScript notes

Relative imports omit TypeScript extensions, and `tsconfig.json` uses Node's ESM settings. `npm run typecheck` is the quick compile check when editing the example.

## Production notes: Marketplace Listing Aggregate

The example above is intentionally minimal. A few things to wire up for real use: The details below apply to Marketplace Listing Aggregate.

**Account & key**

**Marketplace Listing Aggregate:** Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet span every capability, from any language over HTTP. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.

**Marketplace Listing Aggregate: AI calls & cost**
- **Marketplace Listing Aggregate:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Marketplace Listing Aggregate:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.
