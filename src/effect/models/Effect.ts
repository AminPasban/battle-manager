import { EffectTiming, EffectType } from "../enums";
// character
import type { Character } from "@/character";
import type { IEffectMetadata } from "../types";

export abstract class Effect
{
    #applyCount: number = 0;
    #maxApplyCount: number = 1;

    abstract readonly id: string;
    abstract readonly type: EffectType;
    abstract orginalValue: number;
    abstract resultingValue: number;
    readonly target: Character;
    readonly isPositive: boolean;
    readonly applyTiming: EffectTiming;
    readonly expireTiming: EffectTiming;
    public intensity: number;
    public isExpired: boolean = false;
    public metadata: IEffectMetadata;

    constructor(target: Character, intensity: number, applyTiming: EffectTiming, expireTiming: EffectTiming, isPositive: boolean = true)
    {
        this.target = target;
        this.intensity = intensity;
        this.isPositive = isPositive;
        this.applyTiming = applyTiming;
        this.expireTiming = expireTiming;
        this.metadata = { color: this.isPositive ? "#008000" : "#CB0404" };
    }

    static readonly TIMING_ABBREVIATIONS: ReadonlyMap<EffectTiming, string> = new Map([
        [EffectTiming.BeforeAttack, "batk"],
        [EffectTiming.BeforeTakeHit, "bhit"],
        [EffectTiming.AfterTakeHit, "ahit"],
        [EffectTiming.AfterAttack, "aatk"],
    ]);

    static getTimingByAbbreviation(abbreviation: string): EffectTiming | undefined {
        for (const [key, value] of Effect.TIMING_ABBREVIATIONS.entries())
            if (abbreviation === value)
                return key;
    }

    #canApply()
    {
        return !this.isExpired && this.#applyCount < this.#maxApplyCount;
    }

    protected createEffectID()
    {
        const idSegments = [
            this.type,
            this.target.id,
            Effect.TIMING_ABBREVIATIONS.get(this.applyTiming),
            Effect.TIMING_ABBREVIATIONS.get(this.expireTiming),
        ];

        return idSegments.join("-");
    }

    public apply()
    {
        if (this.#canApply())
        {
            this.onApply();
            this.#applyCount++;
        }
    }

    public tryToExpire(): boolean
    {
        if (!this.#canApply())
        {
            this.onExpire();
            this.isExpired = true;
            this.metadata = { color: this.isPositive ? "#CB0404" : "#008000" };
        }

        return this.isExpired;
    }

    protected abstract onApply(): void;
    protected abstract onExpire(): void;
}