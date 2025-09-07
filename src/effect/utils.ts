import { Effect } from "./models/Effect";
import { EffectTiming } from "./enums";
import type { IEffectReport } from "./types";

export class EffectUtils
{
    static filterEffectReport(report: IEffectReport, ...timings: EffectTiming[]): Effect[]
    {
        const effects: Effect[] = [];

        for (const t of timings)
            effects.push(...report[t]);

        return effects;
    }
}