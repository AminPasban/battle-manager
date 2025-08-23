import type { AttackDamage, Damage, ICrit, IMultiAttack, ITalisman, TalismanDamage } from "../damage";
import type { Recovery } from "../recovery";

export interface IAttackResult
{
    damages: Damage[],
    recoveries?: Recovery[];
}

export interface ITakeHitResult
{
    attackDamage: AttackDamage;
    talismanDamage?: TalismanDamage;
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
    readonly min: number;
    readonly max: number;
}