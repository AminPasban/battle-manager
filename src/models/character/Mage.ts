import type { Damage } from "../damage";
import type { Recovery } from "../recovery";
import { Character } from "./Character";
import type { IAttackResult } from "./types";

export class Mage extends Character
{
    protected _maxHP = 980;
    protected _currentHP = 980;
    protected _armor = 2.5;

    readonly power = { min: 178, max: 182 };
    readonly talismanPower = 155;
    readonly talismanChance = 0.35;
    readonly talismanWoundMultiplier = 0.25;
    readonly healMultiplier = 0.05;

    get name()
    {
        return `🧙‍♂️${this._name}`;
    }

    attack(target: Character): IAttackResult
    {
        const damages: Damage[] = [];
        const recoveries: Recovery[] = [];

        const canTriggerTalisman = this.hp > this.talismanPower * this.talismanWoundMultiplier;

        const talisman = {
            power: this.talismanPower,
            chance: canTriggerTalisman ? this.talismanChance : 0
        };

        const takeHitResult = target.takeHit(this, { talisman });
        damages.push(...Object.values(takeHitResult));

        if (takeHitResult.talismanDamage)
        {
            const woundDamage = this.wound(this.talismanPower, this.talismanWoundMultiplier);
            damages.push(woundDamage);
        }
        else
        {
            const heal = this.heal(this.healMultiplier);
            recoveries.push(heal);
        }

        return { damages, recoveries };
    }
}