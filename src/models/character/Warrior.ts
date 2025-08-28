import { AttackDamage, AttackType, type ICrit } from "../damage";
import { Character } from "./Character";

import { ArmorEffect } from "../effect/ArmorEffect";
import type { IAfterAttackResult, IAfterTakeHitResult, IAttackResult, IBeforeAttackResult, IBeforeTakeHitResult, ICritAbility } from "./types";

export class Warrior extends Character<AttackDamage> implements ICritAbility
{
    protected _maxHP = 1200;
    protected _currentHP = 1200;
    protected _armor = 5;

    readonly power = { min: 142, max: 149 };
    readonly crit: ICrit = { multiplier: 2.2, chance: 0.25 };
    readonly lifestealMultiplier = 0.25;

    get name()
    {
        return `⚔️${this._name}`;
    }

    protected onBeforeAttack(): IBeforeAttackResult
    {
        return {};
    }

    onAttack(target: Character): IAttackResult<AttackDamage>
    {
        const damage = new AttackDamage(this, target);
        return { damage };
    }

    protected onAfterAttack(damage: AttackDamage): IAfterAttackResult
    {
        if (damage.attackType === AttackType.Crit)
        {
            const recovery = this.lifesteal(damage.amount, this.lifestealMultiplier);
            return { recoveries: [recovery] };
        }

        return {};
    }

    protected onBeforeTakeHit(): IBeforeTakeHitResult
    {
        const effect = new ArmorEffect(this, 7);
        this.receiveEffect(effect);
        return { effect };
    }

    protected onAfterTakeHit(): IAfterTakeHitResult
    {
        this.removeEffect();
        return {};
    }
}
