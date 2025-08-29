import { Character } from "./Character";
import type { IAttackResult, ICritAbility, IMultiAttackAbility } from "./types";
// damage
import { AttackDamage } from "@/damage";
import type { ICrit, IMultiAttack } from "@/damage/types";
// utils
import Utils from "@/utils";

export class Archer extends Character<AttackDamage> implements ICritAbility, IMultiAttackAbility
{
    protected namePrefix: string = "🏹";
    protected _maxHP = 1080;
    protected _currentHP = 1080;
    protected _armor = 3.5;

    readonly power = { min: 116, max: 126 };
    readonly crit: ICrit = { multiplier: 1.6, chance: 0.5 };
    readonly multiAttack: IMultiAttack = { chance: 1 };

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
}