import type { Character } from "../character";
import type { DamageType } from "./enums";
import type { IDamageMetadata } from "./types";

export abstract class Damage
{
    protected static readonly damageReductionPerArmor = 10;

    readonly abstract amount: number;
    readonly abstract type: DamageType;
    readonly abstract metadata: IDamageMetadata;
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
