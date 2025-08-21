import { Character, type AttackResult } from "./Character";
import { AttackType, Damage } from "../damage";
import type { Recovery } from "../recovery";

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

    attack(target: Character): AttackResult
    {
        const damages: Damage[] = [];
        const recoveries: Recovery[] = [];

        const crit = {
            multiplier: this.critMultiplier,
            chance: this.critChance
        };

        const { damage } = target.takeHit(this, { crit });
        damages.push(damage);

        if (damage.attackType === AttackType.Crit)
        {
            const recovery = this.lifesteal(damage.amount, this.lifestealMultiplier);
            recoveries.push(recovery);
        }

        return { damages, recoveries };
    }
}
