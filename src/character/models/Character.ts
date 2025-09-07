import type { IAfterAttackResult, IBeforeAttackResult, ICharacterPower, ITakeHitResult, IAttackReport, IBeforeTakeHitResult, IAfterTakeHitResult, IAttackResult } from "../types";
// damage
import { AttackDamage, Damage, WoundDamage } from "@/damage";
// recovery
import { HealRecovery, LifestealRecovery, Recovery } from "@/recovery";
// effect
import { Effect } from "@/effect";
import { EffectTiming } from "@/effect/enums";
// utils
import Utils from "@/utils";
import type { CharacterBasics } from "./CharacterBasics";

export abstract class Character<DamageType extends Damage = Damage>
{
    readonly id: string;
    readonly #name: string;
    readonly #basics: CharacterBasics;
    protected abstract readonly namePrefix: string;

    #maxHP: number = 0;
    #currentHP: number = 0;
    #armor: number = 0;
    #power: ICharacterPower = { min: 0, max: 0 };

    public effect: Effect | null = null;

    constructor(name: string)
    {
        this.id = Utils.generateId();
        this.#name = name;
        this.#basics = this.initBasics();
        this.reborn();
    }

    get name()
    {
        return this.namePrefix + this.#name;
    }
    get hp()
    {
        return this.#currentHP;
    }
    get maxHP()
    {
        return this.#maxHP;
    }
    get armor()
    {
        return this.#armor;
    }
    get power()
    {
        return this.#power;
    }
    get powerAVG()
    {
        return Math.round((this.#power.min + this.#power.max) / 2);
    }
    
    reborn()
    {
        this.#maxHP = this.#currentHP = this.#basics.hp;
        this.#armor = this.#basics.armor;
        this.#power.min = this.#basics.power.min;
        this.#power.max = this.#basics.power.max;
        this.effect = null;
    }

    protected abstract initBasics(): CharacterBasics;
    protected abstract onAttack(target: Character): IAttackResult<DamageType>;

    protected onBeforeAttack(): IBeforeAttackResult | void { }
    protected onAfterAttack(_damage: DamageType): IAfterAttackResult | void { }
    protected onBeforeTakeHit(): IBeforeTakeHitResult | void { }
    protected onAfterTakeHit(_damage: Damage): IAfterTakeHitResult | void { }

    #adjustHP(amount: number, increase: boolean = true)
    {
        amount *= increase ? 1 : -1;
        this.#currentHP = Utils.clamp(this.#currentHP + amount, this.#maxHP);
    }

    attack(target: Character): IAttackReport
    {
        this.onBeforeAttack();
        const beforeAttackEffects = this.#checkEffect(EffectTiming.BeforeAttack);

        const attackResult = this.onAttack(target);
        const targetTakeHitResult = target.takeHit(attackResult.damage);

        const afterAttackResult = this.onAfterAttack(attackResult.damage);
        const afterAttackEffects = this.#checkEffect(EffectTiming.AfterAttack);

        const report: IAttackReport =
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
            effects: {
                [EffectTiming.BeforeAttack]: beforeAttackEffects,
                [EffectTiming.BeforeTakeHit]: targetTakeHitResult[EffectTiming.BeforeTakeHit],
                [EffectTiming.AfterTakeHit]: targetTakeHitResult[EffectTiming.AfterTakeHit],
                [EffectTiming.AfterAttack]: afterAttackEffects,
            }
        };

        return Utils.pruneEmpty(report);
    }

    takeHit(damage: Damage): ITakeHitResult
    {
        this.onBeforeTakeHit();
        const beforeTakeHitEffects = this.#checkEffect(EffectTiming.BeforeTakeHit);

        damage.calculate();

        this.#adjustHP(damage.amount, false);
        if (damage instanceof AttackDamage)
            for (const dmg of damage.followUps)
                this.#adjustHP(dmg.amount, false);

        this.onAfterTakeHit(damage);
        const afterTakeHitEffects = this.#checkEffect(EffectTiming.AfterTakeHit);

        return {
            damage,
            [EffectTiming.BeforeTakeHit]: beforeTakeHitEffects,
            [EffectTiming.AfterTakeHit]: afterTakeHitEffects,
        };
    }

    adjustArmor(amount: number, increase: boolean = true): number
    {
        amount *= increase ? 1 : -1;
        this.#armor = Utils.clamp(this.#armor + amount);
        return this.#armor;
    }
    adjustPower(amount: number, increase: boolean = true)
    {
        amount *= increase ? 1 : -1;
        this.#power.min = Utils.clamp(this.#power.min + amount);
        this.#power.max = Utils.clamp(this.#power.max + amount);
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
        this.effect = null;
    }

    #checkEffect(timing: EffectTiming): Effect[]
    {
        const effects = [];

        if (this.effect?.applyTiming === timing)
        {
            this.effect.apply();
            effects.push(Utils.snapshot(this.effect));
        }
        else if (this.effect?.expireTiming === timing)
        {
            const isExpired = this.effect.tryToExpire();
            if (isExpired)
            {
                effects.push(Utils.snapshot(this.effect));
                this.removeEffect();
            }
        }

        return effects;
    }
}