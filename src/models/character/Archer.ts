import { Character } from "./Character";
import Utils from "../../utils";
import type { IAttackResult, ITakeHitResult } from "./types";

export class Archer extends Character
{
    protected _maxHP = 1080;
    protected _currentHP = 1080;
    protected _armor = 3.5;

    readonly power = { min: 116, max: 126 };
    readonly critMultiplier = 1.6;
    readonly critChance = 0.5;
    readonly multiAttackChance = 0.5;

    get name()
    {
        return `🏹${this._name}`;
    }

    attack(target: Character): IAttackResult
    {
        const damages = this.shoot(target);

        if (Utils.isLucky(this.multiAttackChance))
        {
            const followUpDamage = this.shoot(target).attackDamage;
            damages.attackDamage.addFollowUpDamage(followUpDamage);
        }

        return { damages: Object.values(damages) };
    }

    private shoot(target: Character): ITakeHitResult
    {
        const crit = {
            multiplier: this.critMultiplier,
            chance: this.critChance
        };
        return target.takeHit(this, { crit });
    }
}