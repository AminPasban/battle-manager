import type { IAfterAttackResult, IBeforeAttackResult, ICharacterPower, ITakeHitResult, IAttackReport, IBeforeTakeHitResult, IAfterTakeHitResult, IAttackResult } from "./types";
// damage
import { AttackDamage, Damage, WoundDamage } from "@/damage";
// recovery
import { HealRecovery, LifestealRecovery, Recovery } from "@/recovery";
// effect
import { Effect } from "@/effect";
import { EffectTiming } from "@/effect/enums";
// utils
import Utils from "@/utils";

export abstract class Character<DamageType extends Damage = Damage>
{
    readonly #name: string;
    protected readonly abstract namePrefix: string;

    public readonly id: string;
    protected _maxHP: number = 800;
    protected _currentHP: number = 800;
    protected _armor: number = 0;
    readonly power: ICharacterPower = { min: 95, max: 105 };
    public effect: Effect | null = null;

    constructor(name: string)
    {
        this.id = Utils.generateId();
        this.#name = name;
    }

    get name()
    {
        return `${this.namePrefix} ${this.#name}`;
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

    protected abstract onAttack(target: Character): IAttackResult<DamageType>;

    protected onBeforeAttack(): IBeforeAttackResult | void { }
    protected onAfterAttack(_damage: DamageType): IAfterAttackResult | void { }
    protected onBeforeTakeHit(): IBeforeTakeHitResult | void { }
    protected onAfterTakeHit(): IAfterTakeHitResult | void { }

    #adjustHP(amount: number, increase: boolean = true)
    {
        amount *= increase ? 1 : -1;
        this._currentHP = Utils.clamp(this._currentHP + amount, this.maxHP);
    }

    attack(target: Character): IAttackReport
    {
        this.onBeforeAttack();
        this.#checkEffect(EffectTiming.BeforeAttack);

        const attackResult = this.onAttack(target);
        const targetTakeHitResult = target.takeHit(attackResult.damage);

        const afterAttackResult = this.onAfterAttack(attackResult.damage);
        this.#checkEffect(EffectTiming.AffterAttack);

        const report =
        {
            damages: [
                targetTakeHitResult.damage,
                ...(attackResult?.wounds ?? []),
                ...(afterAttackResult?.wounds ?? [])
            ],
            recoveries: [
                ...(attackResult?.recoveries ?? []),
                ...(afterAttackResult?.recoveries ?? [])
            ],
            effects: []
        };

        return Utils.pruneEmpty(report);
    }

    takeHit(damage: Damage): ITakeHitResult
    {
        this.onBeforeTakeHit();
        this.#checkEffect(EffectTiming.BeforeTakeHit);

        damage.calculate();

        this.#adjustHP(damage.amount, false);
        if (damage instanceof AttackDamage)
            for (const dmg of damage.followUps)
                this.#adjustHP(dmg.amount, false);

        this.onAfterTakeHit();
        this.#checkEffect(EffectTiming.AffterTakeHit);

        return { damage };
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
        this.#adjustHP(recovery.amount);
        return recovery;
    }

    lifesteal(damage: number, multiplier: number): Recovery
    {
        const recovery = new LifestealRecovery(this, damage, multiplier);
        this.#adjustHP(recovery.amount);
        return recovery;
    }

    wound(power: number, multiplier: number)
    {
        const woundDamage = new WoundDamage(this, power, multiplier);
        this.#adjustHP(woundDamage.amount, false);
        return woundDamage;
    }

    receiveEffect(effect: Effect)
    {
        this.effect = effect;
    }

    removeEffect()
    {
        const isExpired = this.effect?.expire();

        if (isExpired)
            this.effect = null;
    }

    #checkEffect(timing: EffectTiming)
    {
        if (this.effect?.applyTiming === timing)
            this.effect.apply();
        else if (this.effect?.expireTiming === timing)
            this.removeEffect();
    }
}