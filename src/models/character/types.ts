import type { AttackDamage, Damage } from "../damage";
import type { Recovery } from "../recovery";

export interface IAttackResult
{
    damages: Damage[],
    recoveries?: Recovery[];
}

export interface ITakeAttackResult
{
    damage: AttackDamage;
}

export interface ICharacterPower
{
    readonly min: number;
    readonly max: number;
}