import { Character } from "./Character";
import { CharacterBasics } from "./CharacterBasics";
import type { IAfterAttackResult, IAttackResult, IBeforeTakeHitResult, ICritAbility } from "../types";
// damage
import { AttackDamage } from "@/damage";
import { AttackType } from "@/damage/enums";
import type { ICrit } from "@/damage/types";
// effect
import { ArmorEffect } from "@/effect";
import { EffectTiming } from "@/effect/enums";
// utils
import Utils from "@/utils";

export class Warrior extends Character<AttackDamage> implements ICritAbility
{
    protected namePrefix = "⚔️";

    readonly crit: ICrit = { multiplier: 2.2, chance: 0.25 };
    readonly lifestealMultiplier = 0.25;
    readonly armorEffectIntensity = 7;
    readonly receiveArmorEffectChance = 0.2;

    protected initBasics(): CharacterBasics
    {
        return new CharacterBasics(1200, 5, { min: 142, max: 149 });
    }

    onAttack(target: Character): IAttackResult<AttackDamage>
    {
        return { damage: new AttackDamage(this, target) };
    }

    protected onBeforeAttack(): IBeforeTakeHitResult | void
    {
        if (Utils.isLucky(this.receiveArmorEffectChance))
        {
            const effect = new ArmorEffect(
                this,
                this.armorEffectIntensity,
                EffectTiming.BeforeTakeHit,
                EffectTiming.AfterTakeHit
            );
            this.receiveEffect(effect);
        }
    }

    protected onAfterAttack(damage: AttackDamage): IAfterAttackResult | void
    {
        if (damage.attackType === AttackType.Crit)
        {
            const recovery = this.lifesteal(damage.amount, this.lifestealMultiplier);
            return { recoveries: [recovery] };
        }
    }
}