import Utils from "../../utils";
import { AttackDamage, Damage, WoundDamage } from "../damage";
import type { Effect } from "../effect";
import { HealRecovery, LifestealRecovery, Recovery } from "../recovery";
import type { IAfterAttackResult, IBeforeAttackResult, ICharacterPower, ITakeHitResult, IAttackReport, IBeforeTakeHitResult, IAfterTakeHitResult, IAttackResult } from "./types";

export abstract class Character<DamageType extends Damage = Damage>
{
    public readonly id: string;
    protected readonly _name: string;
    protected _maxHP: number = 800;
    protected _currentHP: number = 800;
    protected _armor: number = 0;
    readonly power: ICharacterPower = { min: 95, max: 105 };
    public effect: Effect | null = null;

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

    protected abstract onBeforeAttack(): IBeforeAttackResult;
    protected abstract onAttack(target: Character): IAttackResult<DamageType>;
    protected abstract onAfterAttack(damage: DamageType): IAfterAttackResult;
    protected abstract onBeforeTakeHit(): IBeforeTakeHitResult;
    protected abstract onAfterTakeHit(): IAfterTakeHitResult;

    private _adjustHP(amount: number, increase: boolean = true)
    {
        amount *= increase ? 1 : -1;
        this._currentHP = Utils.clamp(this._currentHP + amount, this.maxHP);
    }

    attack(target: Character): IAttackReport
    {
        const beforeAttackResult = this.onBeforeAttack();
        const attackResult = this.onAttack(target);
        const targetTakeHitResult = target.takeHit(attackResult.damage);
        const afterAttackResult = this.onAfterAttack(attackResult.damage);

        const report =
        {
            damages: [
                targetTakeHitResult.damage,
                ...(attackResult.wounds ?? []),
                ...(afterAttackResult.wounds ?? [])
            ],
            recoveries: [
                ...(attackResult.recoveries ?? []),
                ...(afterAttackResult.recoveries ?? [])
            ],
            effects: {
                source: {
                    beforeAttack: beforeAttackResult.effect,
                    afterAttack: afterAttackResult.effect
                },
                target: targetTakeHitResult.effects
            }
        };

        return Utils.pruneEmpty(report);
    }

    takeHit(damage: Damage): ITakeHitResult
    {
        const beforeTakeHitResult = this.onBeforeTakeHit();

        damage.calculate();

        this._adjustHP(damage.amount, false);
        if (damage instanceof AttackDamage)
            for (const dmg of damage.followUps)
                this._adjustHP(dmg.amount, false);

        const afterTakeHitResult = this.onAfterTakeHit();

        return {
            damage,
            effects: {
                beforeTakeHit: beforeTakeHitResult.effect,
                afterTakeHit: afterTakeHitResult.effect,
            }
        };
    }

    adjustArmor(amount: number, increase: boolean = true)
    {
        amount *= increase ? 1 : -1;
        this._armor = Utils.clamp(this._armor + amount);
    }
    adjustPower(amount: number, increase: boolean = true)
    {
        amount *= increase ? 1 : -1;
        this.power.min = Utils.clamp(this.power.min + amount);
        this.power.max = Utils.clamp(this.power.max + amount);
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

    receiveEffect(effect: Effect)
    {
        this.effect = effect;
        this.effect.apply();
    }

    removeEffect()
    {
        this.effect?.expire();
        this.effect = null;
    }
}