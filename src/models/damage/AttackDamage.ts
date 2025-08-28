import Utils from "../../utils";
import type { Character, ICritAbility } from "../character";
import { Damage } from "./Damage";
import { AttackType, DamageType } from "./enums";
import type { IAttackSpecialEffects, IDamageMetadata } from "./types";

export class AttackDamage extends Damage
{
    readonly type: DamageType = DamageType.Attack;
    readonly attackType: AttackType = AttackType.Basic;
    readonly source: Character | (Character & ICritAbility);
    readonly specialEffects: IAttackSpecialEffects = {};
    readonly followUps: Damage[] = [];
    readonly metadata: IDamageMetadata = { color: "#2D3250" };

    private _snapshotAmount: number;

    constructor(source: Character | (Character & ICritAbility), target: Character)
    {
        super(target);
        this.source = source;

        this.amount = Utils.randomInRange(this.source.power.min, this.source.power.max);

        if ("crit" in source && Utils.isLucky(source.crit.chance))
        {
            this.amount *= source.crit.multiplier;
            this.attackType = AttackType.Crit;
            this.specialEffects.critMultiplier = source.crit.multiplier;
            this.metadata.color = "#CB0404";
        }

        this._snapshotAmount = this.amount;

        this.calculate();
    }

    calculate(): void
    {
        const armorReduction = Damage.getArmorReduction(this.target.armor);
        this.amount = Utils.clamp(Math.round(this._snapshotAmount - armorReduction));
        this.targetHPAfterDamage = Utils.clamp(this.targetHPBeforeDamage - this.amount);

        for (const dmg of this.followUps)
        {
            dmg.calculate();
            this._calculateFollowUp(dmg);
        }
    }

    addFollowUp(damage: Damage)
    {
        this._calculateFollowUp(damage);
        this.followUps.push(damage);
    }

    private _calculateFollowUp(damage: Damage)
    {
        damage.targetHPBeforeDamage = this.targetHPAfterDamage;
        damage.targetHPAfterDamage = Utils.clamp(this.targetHPAfterDamage - damage.amount);
    }
}