import { Character } from "./Character";
import type { IAfterAttackResult, IAfterTakeHitResult, IAttackResult, IBeforeTakeHitResult, ICritAbility } from "../types";
// damage
import { AttackDamage } from "@/damage";
import { AttackType } from "@/damage/enums";
import type { ICrit } from "@/damage/types";
// effect
import { ArmorEffect } from "@/effect";
import { EffectTiming } from "@/effect/enums";

export class Warrior extends Character<AttackDamage> implements ICritAbility
{
    protected namePrefix = "⚔️";
    protected _maxHP = 1200;
    protected _currentHP = 1200;
    protected _armor = 5;

    readonly power = { min: 142, max: 149 };
    readonly crit: ICrit = { multiplier: 2.2, chance: 0.25 };
    readonly lifestealMultiplier = 0.25;

    onAttack(target: Character): IAttackResult<AttackDamage>
    {
        const damage = new AttackDamage(this, target);
        return { damage };
    }

    protected onAfterAttack(damage: AttackDamage): IAfterAttackResult | void
    {
        if (damage.attackType === AttackType.Crit)
        {
            const recovery = this.lifesteal(damage.amount, this.lifestealMultiplier);
            return { recoveries: [recovery] };
        }
    }

    protected onBeforeTakeHit(): IBeforeTakeHitResult | void
    {
        const effect = new ArmorEffect(this, 7, EffectTiming.BeforeTakeHit, EffectTiming.AffterTakeHit);
        this.receiveEffect(effect);
    }

    protected onAfterTakeHit(): IAfterTakeHitResult | void
    {
        this.removeEffect();
    }
}
