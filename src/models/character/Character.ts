import Utils from "../../utils";
import { Damage, WoundDamage } from "../damage";
import { HealRecovery, LifestealRecovery, Recovery } from "../recovery";
import type { IAttackResult, ICharacterPower } from "./types";

export abstract class Character
{
    public readonly id: string;
    protected readonly _name: string;
    protected _maxHP: number = 800;
    protected _currentHP: number = 800;
    protected _armor: number = 0;
    readonly power: ICharacterPower = { min: 95, max: 105 };

    constructor(name: string)
    {
        this.id = Utils.generateId();
        this._name = name;
    }

    get hp()
    {
        return this._currentHP;
    }
    get maxHP()
    {
        return this._maxHP;
    }
    get armor()
    {
        return this._armor;
    }
    abstract get name(): string;

    abstract attack(enemy: Character): IAttackResult;

    private _adjustHP(amount: number, increase: boolean = true)
    {
        amount *= increase ? 1 : -1;
        this._currentHP = Utils.clamp(this._currentHP + amount, this.maxHP);
    }

    protected onBeforeTakeHit() { }
    protected onAfterTakeHit() { }

    takeHit(...damages: Damage[])
    {
        this.onBeforeTakeHit();

        for (const dmg of damages)
            this._adjustHP(dmg.amount, false);

        this.onAfterTakeHit();
    }

    adjustArmor(amount: number, increase: boolean = true)
    {
        amount *= increase ? 1 : -1;
        this._armor = Utils.clamp(this._armor + amount, Infinity);
    }

    reborn()
    {
        this._currentHP = this.maxHP;
    }

    heal(multiplier: number): Recovery
    {
        const recovery = new HealRecovery(this, multiplier);
        this._adjustHP(recovery.amount);
        return recovery;
    }

    lifesteal(damage: number, multiplier: number): Recovery
    {
        const recovery = new LifestealRecovery(this, damage, multiplier);
        this._adjustHP(recovery.amount);
        return recovery;
    }

    wound(power: number, multiplier: number)
    {
        const woundDamage = new WoundDamage(this, power, multiplier);
        this._adjustHP(woundDamage.amount, false);
        return woundDamage;
    }
}