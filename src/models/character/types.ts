import type { Damage, ICrit, IMultiAttack, ITalisman, WoundDamage } from "../damage";
import type { Effect } from "../effect";
import type { Recovery } from "../recovery";

export interface IBeforeAttackResult
{
    effect?: Effect;
}
export interface IAttackResult<T>
{
    damage: T;
    recoveries?: Recovery[];
    wounds?: WoundDamage[];
}
export interface IAfterAttackResult
{
    recoveries?: Recovery[];
    wounds?: WoundDamage[];
    effect?: Effect;
}

export interface IBeforeTakeHitResult
{
    effect?: Effect;
}
export interface ITakeHitResult
{
    damage: Damage;
    effects?: {
        beforeTakeHit?: Effect;
        afterTakeHit?: Effect;
    };
}
export interface IAfterTakeHitResult
{
    effect?: Effect;
}

export interface IAttackReport
{
    damages: Damage[],
    recoveries?: Recovery[];
    effects?: {
        source?: {
            beforeAttack?: Effect;
            afterAttack?: Effect;
        },
        target?: {
            beforeTakeHit?: Effect;
            afterTakeHit?: Effect;
        },
    };
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

export interface ICharacterPower
{
    min: number;
    max: number;
}