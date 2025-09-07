import type { DamageType } from "../enums";
import type { IDamageMetadata } from "../types";
// character
import type { Character } from "@/character";

export abstract class Damage
{
    protected static readonly damageReductionPerArmor = 10;

    readonly abstract type: DamageType;
    readonly abstract metadata: IDamageMetadata;
    readonly abstract source: Character;
    readonly target: Character;
    public amount: number = 0;
    public targetHPBeforeDamage: number;
    public targetHPAfterDamage: number;

    constructor(target: Character)
    {
        this.target = target;
        this.targetHPBeforeDamage = target.hp;
        this.targetHPAfterDamage = target.hp;
    }

    abstract calculate(): void;

    static getArmorReduction(armor: number): number
    {
        return armor * this.damageReductionPerArmor;
    }
}
