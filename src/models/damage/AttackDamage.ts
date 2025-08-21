import Utils from "../../utils";
import type { Character } from "../character";
import { Damage } from "./Damage";
import { AttackType, DamageType } from "./enums";
import type { IAttackSpecialEffects, IDamageMetadata } from "./types";

export class AttackDamage extends Damage
{
    readonly type: DamageType = DamageType.Attack;
    readonly metadata: IDamageMetadata = { color: "#2D3250" };

    readonly amount: number = 0;
    readonly attackType: AttackType = AttackType.Basic;
    readonly targetHPAfterDamage: number;
    readonly specialEffects: IAttackSpecialEffects = {};
    readonly followUpDamages: AttackDamage[] = [];

    constructor(source: Character, target: Character, critMulitiplier: number = 0, critChance: number = 0)
    {
        super(source, target);

        this.amount = Utils.randomInRange(source.power.min, source.power.max);

        if (Utils.isLucky(critChance))
        {
            this.attackType = AttackType.Crit;
            this.amount *= critMulitiplier;
            this.specialEffects.critMultiplier = critMulitiplier;
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