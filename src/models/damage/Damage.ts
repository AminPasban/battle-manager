import type { Character } from "../character";

export enum DamageType
{
    Attack = "Attack",
    Talisman = "Talisman",
    Wound = "Wound",
}

export interface DamageMetadata
{
    color: string;
}

export abstract class Damage
{
    protected static readonly damageReductionPerArmor = 10;

    readonly abstract amount: number;
    readonly abstract type: DamageType;
    readonly abstract metadata: DamageMetadata;
    readonly abstract targetHPAfterDamage: number;
    readonly source: Character;
    readonly target: Character;
    readonly targetHPBeforeDamage: number;

    constructor(source: Character, target: Character)
    {
        this.source = source;
        this.target = target;
        this.targetHPBeforeDamage = target.hp;
    }

    static getArmorReduction(armor: number): number
    {
        return armor * this.damageReductionPerArmor;
    }
}
