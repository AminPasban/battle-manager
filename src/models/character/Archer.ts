import Utils from "../../utils";
import { AttackDamage, type ICrit, type IMultiAttack } from "../damage";
import { Character } from "./Character";
import type { IAfterAttackResult, IAttackResult, IBeforeAttackResult, IBeforeTakeHitResult, ICritAbility, IMultiAttackAbility } from "./types";

export class Archer extends Character<AttackDamage> implements ICritAbility, IMultiAttackAbility
{
    protected _maxHP = 1080;
    protected _currentHP = 1080;
    protected _armor = 3.5;

    readonly power = { min: 116, max: 126 };
    readonly crit: ICrit = { multiplier: 1.6, chance: 0.5 };
    readonly multiAttack: IMultiAttack = { chance: 1 };

    get name()
    {
        return `🏹${this._name}`;
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

    protected onBeforeAttack(): IBeforeAttackResult
    {
        return {};
    }
    protected onBeforeTakeHit(): IBeforeTakeHitResult
    {
        return {};
    }
    protected onAfterTakeHit(): IAfterAttackResult
    {
        return {};
    }
    protected onAfterAttack(): IAfterAttackResult
    {
        return {};
    }
}