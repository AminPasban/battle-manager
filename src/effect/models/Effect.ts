import { EffectTiming, EffectType } from "../enums";
import type { IEffectMetadata } from "../types";
// character
import type { Character } from "@/character";

export abstract class Effect
{
    #appliedCount: number = 0;
    #maxApplications: number = 1;
    #magnitude: number;

    abstract readonly id: string;
    abstract readonly type: EffectType;

    abstract baseValue: number;
    abstract currentValue: number;
    public appliedValue: number = 0;
    public totalAppliedValue: number = 0;

    readonly target: Character;
    readonly source: Character;
    readonly isBuff: boolean;
    readonly applyTiming: EffectTiming;
    readonly expireTiming: EffectTiming;

    public isExpired: boolean = false;
    public metadata: IEffectMetadata;

    constructor(target: Character, source: Character, magnitude: number, applyTiming: EffectTiming, expireTiming: EffectTiming, isBuff: boolean = true)
    {
        this.target = target;
        this.source = source;
        this.#magnitude = magnitude;
        this.isBuff = isBuff;
        this.applyTiming = applyTiming;
        this.expireTiming = expireTiming;
        this.metadata = { color: this.isBuff ? "#008000" : "#CB0404" };
    }

    get magnitude()
    {
        return this.#magnitude;
    }

    protected abstract onApply(): void;
    protected abstract onExpire(): void;

    #canApply()
    {
        return !this.isExpired && this.#appliedCount < this.#maxApplications;
    }

    public apply()
    {
        if (this.#canApply())
        {
            this.onApply();
            this.#appliedCount++;
            this.appliedValue = Math.abs(this.currentValue - this.baseValue);
            this.totalAppliedValue += this.appliedValue;
        }
    }

    public update(effect: Effect)
    {
        if (this.id !== effect.id)
            throw new Error(`Effect update failed: IDs do not match (${this.id} != ${effect.id})`);

        this.#magnitude += effect.magnitude;
    }

    public tryToExpire(): boolean
    {
        if (!this.#canApply())
        {
            this.onExpire();
            this.isExpired = true;
            this.metadata = { color: this.isBuff ? "#CB0404" : "#008000" };
        }

        return this.isExpired;
    }

    public snapshot()
    {
        return { ...this, magnitude: this.#magnitude };
    }

    protected createEffectId(seed: string)
    {
        const idSegments = [
            seed,
            this.source.id,
            this.target.id,
            Effect.TIMING_ABBREVIATIONS.get(this.applyTiming),
            Effect.TIMING_ABBREVIATIONS.get(this.expireTiming),
        ];

        return (this.isBuff ? "+" : "-") + idSegments.join("-");
    }

    static readonly TIMING_ABBREVIATIONS: ReadonlyMap<EffectTiming, string> = new Map([
        [EffectTiming.BeforeAttack, "batk"],
        [EffectTiming.BeforeTakeHit, "bhit"],
        [EffectTiming.AfterTakeHit, "ahit"],
        [EffectTiming.AfterAttack, "aatk"],
    ]);

    static getTimingByAbbreviation(abbreviation: string): EffectTiming | undefined
    {
        for (const [key, value] of Effect.TIMING_ABBREVIATIONS.entries())
            if (abbreviation === value)
                return key;
    }
}