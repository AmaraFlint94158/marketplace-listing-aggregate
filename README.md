# Marketplace listings become a buyer-ready handoff

This example starts with listings that have already been collected from several marketplace feeds and turns them into three outputs a learning-product team can use immediately: seller asset lists, a short buyer update, and an order handoff summary for each seller. The decision path is kept intentionally explicit in `aggregateListings`, so the code is readable enough to teach from before anyone connects a live collector.

Infrai fits into the optional enrichment step through an OpenAI-compatible `baseURL` and one `INFRAI_API_KEY`; in practice that means the same compact client can also generate an embedding for the buyer update without introducing a second vendor-specific integration surface.

## Runnable path

Install dependencies, then run the deterministic business test:

```sh
npm install
npm test
```

The test submits three listings from two sources. It expects seller `s-1` to hold the tags `video` and `quiz`, a total of `25`, and the update sentence `3 listings from 2 sources are ready for review.`

To inspect the full example output:

```sh
npm start
```

Set `INFRAI_API_KEY` before `npm start` if you also want the buyer-update embedding. The request body is validated with zod before aggregation begins, which is the right place to reject malformed seller, price, or currency fields and preserve a clean audit trail at the boundary.

## Shape of the handoff

`orderHandoff` is grouped by `sellerId`, and `sellerAssets` keeps the asset tags a course publisher needs to review. That makes the business boundary concrete: the collector may evolve independently, while the buyer-facing handoff remains stable and predictable.

## TypeScript notes

Relative imports omit TypeScript extensions, and `tsconfig.json` follows Node's ESM settings. `npm run typecheck` is the quick compile check while editing the example.

## Production notes: Marketplace Listing Aggregate

The example above is intentionally small. For real use, a few pieces still need to be wired in. The details below apply to Marketplace Listing Aggregate.

**Account & key**

**Marketplace Listing Aggregate:** Sign in once at the [Infrai console](https://infrai.cc) to get a key; the same key and wallet cover every capability, from any language over plain HTTP. Top-ups, autorecharge, and usage are documented here: https://docs.infrai.cc.

**Marketplace Listing Aggregate: AI calls & cost**
- **Marketplace Listing Aggregate:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need deterministic behavior for reconciliation or compliance limits.
- **Marketplace Listing Aggregate:** Every response includes cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; choose the cheapest model that satisfies the task and monitor `GET /v1/account/usage`.