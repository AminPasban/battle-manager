// damage
import type { Damage, WoundDamage } from "@/damage";
import type { ICrit, IMultiAttack, ITalisman } from "@/damage/types";
// recovery
import type { Recovery } from "@/recovery";
// effect
import type { Effect } from "@/effect";

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
    effects?: Effect[];
}

export interface IBeforeTakeHitResult { }

export interface IAfterTakeHitResult { }

export interface IAttackReport
{
    damages: Damage[],
    recoveries?: Recovery[];
    effects?: Effect[];
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