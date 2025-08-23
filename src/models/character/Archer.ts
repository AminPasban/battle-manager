import { Character } from "./Character";
import Utils from "../../utils";
import type { IAttackResult, ICritAbility, IMultiAttackAbility } from "./types";
import { AttackDamage, type ICrit, type IMultiAttack } from "../damage";

export class Archer extends Character implements ICritAbility, IMultiAttackAbility
{
    protected _maxHP = 1080;
    protected _currentHP = 1080;
    protected _armor = 3.5;

    readonly power = { min: 116, max: 126 };
    readonly crit: ICrit = { multiplier: 1.6, chance: 0.5 };
    readonly multiAttack: IMultiAttack = { chance: 0.5 };

    get name()
    {
        return `🏹${this._name}`;
    }

    attack(target: Character): IAttackResult
    {
        const damage = new AttackDamage(this, target, this.crit);
        target.takeHit(damage);

        if (Utils.isLucky(this.multiAttack.chance))
        {
            const followUpDamage = new AttackDamage(this, target, this.crit);
            damage.addFollowUpDamage(followUpDamage);
            target.takeHit(followUpDamage);
        }

        return { damages: [damage] };
    }
}