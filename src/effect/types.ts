import type { Effect } from "./models/Effect";
import type { EffectTiming } from "./enums";

export interface IEffectMetadata
{
    color: string;
}

export interface IEffectReport extends Record<EffectTiming, Effect[]> { }