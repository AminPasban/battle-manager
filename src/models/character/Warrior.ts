import { Character } from "./Character";
import { AttackType } from "../damage";
import type { Recovery } from "../recovery";

import type { IAttackResult } from "./types";

export class Warrior extends Character
{
    protected _maxHP = 1200;
    protected _currentHP = 1200;
    protected _armor = 5;

    readonly power = { min: 142, max: 149 };
    readonly critMultiplier = 2.2;
    readonly critChance = 0.25;
    readonly lifestealMultiplier = 0.25;
    readonly gainArmorAmount = 7;
    readonly gainArmorChance = 1;

    get name()
    {
        return `⚔️${this._name}`;
    }

    attack(target: Character): IAttackResult
    {
        const crit = {
            multiplier: this.critMultiplier,
            chance: this.critChance
        };
        
        const damages = target.takeHit(this, { crit });
        
        const recoveries: Recovery[] = [];

        if (damages.attackDamage.attackType === AttackType.Crit)
        {
            const recovery = this.lifesteal(damages.attackDamage.amount, this.lifestealMultiplier);
            recoveries.push(recovery);
        }

        return { damages: Object.values(damages), recoveries };
    }
}
