import { Damage, DamageType, type DamageMetadata } from "./Damage";
import type { Character } from "../character";
import Utils from "../../utils";

export enum AttackType
{
    Basic = "basic",
    Crit = "crit"
}

export interface AttackSpecialOptions
{
    crit?: {
        multiplier: number;
        chance: number;
    };
}

export interface AttackSpecialEffects
{
    critMultiplier?: number;
}

export class AttackDamage extends Damage
{
    readonly type: DamageType = DamageType.Attack;
    readonly metadata: DamageMetadata = { color: "#2D3250" };

    readonly amount: number = 0;
    readonly attackType: AttackType = AttackType.Basic;
    readonly targetHPAfterDamage: number;
    readonly specialEffects: AttackSpecialEffects = {};
    readonly followUpDamages: AttackDamage[] = [];

    constructor(source: Character, target: Character, specialOptions?: AttackSpecialOptions)
    {
        super(source, target);

        this.amount = Utils.randomInRange(source.power.min, source.power.max);

        if (specialOptions?.crit && Utils.isLucky(specialOptions.crit.chance))
        {
            this.attackType = AttackType.Crit;
            this.amount *= specialOptions.crit.multiplier;
            this.specialEffects.critMultiplier = specialOptions.crit.multiplier;
            this.metadata.color = "#CB0404";
        }

        const armorReduction = Damage.getArmorReduction(target.armor);
        this.amount = Math.max(0, Math.round(this.amount) - armorReduction);
        this.targetHPAfterDamage = Utils.clamp(this.targetHPBeforeDamage - this.amount, target.maxHP);
    }

    addFollowUpDamage(damage: AttackDamage)
    {
        this.followUpDamages.push(damage);
    }
}