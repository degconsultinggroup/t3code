// Fork change: product analytics removed. Upstream sent usage events to ingest.t3.codes,
// which forwarded them to PostHog. This service keeps the same interface so callers compile,
// but it never buffers, never reads or writes an install id, and never opens a connection.
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import type { TelemetryOwner } from "./Identify.ts";

export class AnalyticsService extends Context.Service<
  AnalyticsService,
  {
    /** Always false: nothing is ever queued or sent. */
    readonly record: (
      event: string,
      properties?: Readonly<Record<string, unknown>>,
      options?: { readonly anonymous?: boolean },
    ) => Effect.Effect<boolean>;

    readonly flush: Effect.Effect<void>;

    readonly recordOwners: (
      owners: ReadonlyArray<TelemetryOwner>,
      observedBy: "server" | "client",
    ) => Effect.Effect<void>;
  }
>()("t3/telemetry/AnalyticsService") {}

/** @public */
export const make = Effect.succeed(
  AnalyticsService.of({
    record: () => Effect.succeed(false),
    flush: Effect.void,
    recordOwners: () => Effect.void,
  }),
);

export const layer = Layer.effect(AnalyticsService, make);
