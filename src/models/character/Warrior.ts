import { Character } from "./Character";
import { AttackDamage, AttackType, type ICrit } from "../damage";
import type { Recovery } from "../recovery";

import type { IAttackResult, ICritAbility } from "./types";

export class Warrior extends Character implements ICritAbility
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

    attack(target: Character): IAttackResult
    {
        const damage = new AttackDamage(this, target, this.crit);
        target.takeHit(damage);

        const recoveries: Recovery[] = [];

        if (damage.attackType === AttackType.Crit)
        {
            const recovery = this.lifesteal(damage.amount, this.lifestealMultiplier);
            recoveries.push(recovery);
        }

        return { damages: [damage], recoveries };
    }
}
