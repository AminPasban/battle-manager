import { Character } from "./Character";
import { CharacterBasics } from "./CharacterBasics";
import type { IAfterAttackResult, IAttackResult, ICritAbility, IMultiAttackAbility } from "../types";
// damage
import { AttackDamage } from "@/damage";
import { AttackType } from "@/damage/enums";
import type { ICrit, IMultiAttack } from "@/damage/types";
// effects
import { PowerEffect } from "@/effect";
import { EffectTiming } from "@/effect/enums";
// utils
import Utils from "@/utils";

export class Archer extends Character<AttackDamage> implements ICritAbility, IMultiAttackAbility
{
    protected namePrefix: string = "🏹";

    readonly crit: ICrit = { multiplier: 1.6, chance: 0.5 };
    readonly multiAttack: IMultiAttack = { chance: 0.5 };

    protected initBasics(): CharacterBasics
    {
        return new CharacterBasics(1080, 3.5, { min: 116, max: 126 });
    }

    onAttack(target: Character): IAttackResult<AttackDamage>
    {
        const damage = new AttackDamage(this, target);

        if (Utils.isLucky(this.multiAttack.chance))
        {
            const followUpDamage = new AttackDamage(this, target);
            damage.addFollowUp(followUpDamage);
        }

        return { damage };
    }

    protected onAfterTakeHit(damage: AttackDamage): IAfterAttackResult | void
    {
        if (damage instanceof AttackDamage && damage.attackType === AttackType.Crit)
        {
            const effect = new PowerEffect(
                this,
                75,
                EffectTiming.AfterTakeHit,
                EffectTiming.AfterAttack
            );
            this.receiveEffect(effect);
        }
    }
}