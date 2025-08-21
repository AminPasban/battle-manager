import type { AttackDamage, Damage, TalismanDamage } from "../damage";
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

export interface ICharacterPower
{
    readonly min: number;
    readonly max: number;
}