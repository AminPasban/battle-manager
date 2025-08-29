import type { EffectTiming } from "../enums";
// character
import type { Character } from "@/character";

export abstract class Effect
{
    #applyCount: number = 0;
    #maxApplyCount: number = 1;
    
    readonly target: Character;
    readonly isPositive: boolean;
    readonly applyTiming: EffectTiming;
    readonly expireTiming: EffectTiming;
    public value: number;
    public isExpired: boolean = false;

    constructor(target: Character, value: number, applyTiming: EffectTiming, expireTiming: EffectTiming, isPositive: boolean = true)
    {
        this.target = target;
        this.value = value;
        this.isPositive = isPositive;
        this.applyTiming = applyTiming;
        this.expireTiming = expireTiming;
    }

    #canApply()
    {
        return this.#applyCount < this.#maxApplyCount;
    }

    public apply()
    {
        if (!this.#canApply()) 
            return;

        this.onApply();
        this.#applyCount++;
    }

    public expire(): boolean
    {
        if (!this.isExpired && !this.#canApply()) {
            this.onExpire();
            this.isExpired = true;
        }

        return this.isExpired;
    }

    protected abstract onApply(): void;
    protected abstract onExpire(): void;
}