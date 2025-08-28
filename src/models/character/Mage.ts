import { AttackDamage, TalismanDamage, WoundDamage, type ITalisman } from "../damage";
import type { Recovery } from "../recovery";
import { Character } from "./Character";
import type { IAfterAttackResult, IAfterTakeHitResult, IAttackResult, IBeforeTakeHitResult, ITalismanAbility } from "./types";

export class Mage extends Character<AttackDamage> implements ITalismanAbility
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

    protected onBeforeAttack(): IAfterAttackResult
    {
        return {};
    }

    onAttack(target: Character): IAttackResult<AttackDamage>
    {
        const recoveries: Recovery[] = [];
        const wounds: WoundDamage[] = [];

        const damage = new AttackDamage(this, target);

        const canTriggerTalisman = this.hp > this.talisman.power * this.talismanWoundMultiplier;
        const talismanDamage = new TalismanDamage(this, target);

        if (canTriggerTalisman && talismanDamage.isTriggerd)
        {
            damage.addFollowUp(talismanDamage);
            const woundDamage = this.wound(this.talisman.power, this.talismanWoundMultiplier);
            wounds.push(woundDamage);
        }
        else
        {
            const heal = this.heal(this.healMultiplier);
            recoveries.push(heal);
        }

        return { damage, recoveries, wounds };
    }

    protected onAfterAttack(): IAfterAttackResult
    {
        return {};
    }

    protected onBeforeTakeHit(): IBeforeTakeHitResult
    {
        return {};
    }

    protected onAfterTakeHit(): IAfterTakeHitResult
    {
        return {};
    }
}