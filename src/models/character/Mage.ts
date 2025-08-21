import { Character } from "./Character";
import { Damage, TalismanDamage } from "../damage";
import type { Recovery } from "../recovery";
import Utils from "../../utils";
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
        return `🧙‍♂️${this._name}`
    }

    attack(target: Character): IAttackResult
    {
        const damages: Damage[] = [];
        const recoveries: Recovery[] = []

        const { damage } = target.takeHit(this);
        damages.push(damage);

        const talismanDamage = this.talisman(target);
        if (talismanDamage)
        {
            const woundDamage = this.wound(this.talismanPower, this.talismanWoundMultiplier);
            damages.push(talismanDamage, woundDamage);
        }
        else
        {
            const heal = this.heal(this.healMultiplier);
            recoveries.push(heal);
        }

        return { damages, recoveries };
    }

    talisman(target: Character): TalismanDamage | undefined
    {
        const canTriggerTalisman = this.hp > this.talismanPower * this.talismanWoundMultiplier;

        if (canTriggerTalisman && Utils.isLucky(this.talismanChance))
            return target.takeTalisman(this, this.talismanPower)
    }
}