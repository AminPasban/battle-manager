// damage
import type { Damage, WoundDamage } from "@/damage";
import type { ICrit, IMultiAttack, ITalisman } from "@/damage/types";
// recovery
import type { Recovery } from "@/recovery";
// effect
import type { Effect } from "@/effect";
import type { EffectTiming } from "@/effect/enums";
import type { IEffectReport } from "@/effect/types";

export interface IAttackResult<T>
{
    damage: T;
    recoveries?: Recovery[];
    wounds?: WoundDamage[];
}

export interface IBeforeAttackResult { }

export interface IAfterAttackResult
{
    recoveries?: Recovery[];
    wounds?: WoundDamage[];
}

export interface ITakeHitResult
{
    damage: Damage;
    [EffectTiming.BeforeTakeHit]: Effect[];
    [EffectTiming.AfterTakeHit]: Effect[];
}

export interface IBeforeTakeHitResult { }

export interface IAfterTakeHitResult { }

export interface IAttackReport
{
    damages: Damage[],
    recoveries: Recovery[];
    effects: IEffectReport;
}

export interface ICharacterName
{
    readonly base: string;
    readonly prefix: string;
}

export interface ICharacterBasicPower
{
    readonly min: number;
    readonly max: number;
}

export interface ICharacterPower
{
    min: number;
    max: number;
}

export interface ICritAbility
{
    crit: ICrit;
}

export interface ITalismanAbility
{
    talisman: ITalisman;
    talismanWoundMultiplier: number;
}

export interface IMultiAttackAbility
{
    multiAttack: IMultiAttack;
}