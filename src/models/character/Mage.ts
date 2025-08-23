import { AttackDamage, TalismanDamage, type Damage, type ITalisman } from "../damage";
import type { Recovery } from "../recovery";
import { Character } from "./Character";
import type { IAttackResult, ITalismanAbility } from "./types";

export class Mage extends Character implements ITalismanAbility
{
    protected _maxHP = 980;
    protected _currentHP = 980;
    protected _armor = 2.5;

    readonly power = { min: 178, max: 182 };
    readonly talisman: ITalisman = { power: 155, chance: 0.35 };
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

        const attackDamage = new AttackDamage(this, target);
        damages.push(attackDamage);
        target.takeHit(attackDamage);

        const canTriggerTalisman = this.hp > this.talisman.power * this.talismanWoundMultiplier;
        const talismanDamage = new TalismanDamage(this, target, this.talisman.power, this.talisman.chance);

        if (canTriggerTalisman && talismanDamage.isTriggerd)
        {
            const woundDamage = this.wound(this.talisman.power, this.talismanWoundMultiplier);
            damages.push(talismanDamage, woundDamage);
            target.takeHit(talismanDamage);
        }
        else
        {
            const heal = this.heal(this.healMultiplier);
            recoveries.push(heal);
        }

        return { damages, recoveries };
    }
}