import { CharacterBasics } from "./CharacterBasics";
import { CharacterStatus } from "../enums";
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

export abstract class Character<DamageType extends Damage = Damage>
{
    readonly #name: string;
    readonly #basics: CharacterBasics;
    abstract readonly id: string;
    protected abstract readonly tag: string;

    #maxHP: number = 0;
    #currentHP: number = 0;
    #armor: number = 0;
    #power: ICharacterPower = { min: 0, max: 0 };

    public status: CharacterStatus = CharacterStatus.Ready;
    public effects: Effect[] = [];

    constructor(name: string)
    {
        this.#name = name;
        this.#basics = this.initBasics();
        this.reborn();
    }

    get name()
    {
        return this.tag + this.#name;
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
        this.#maxHP = this.#basics.hp;
        this.#currentHP = this.#basics.hp;
        this.#armor = this.#basics.armor;
        this.#power.min = this.#basics.power.min;
        this.#power.max = this.#basics.power.max;
        this.status = CharacterStatus.Ready;
        this.effects = [];
    }

    protected abstract initBasics(): CharacterBasics;
    protected abstract onAttack(target: Character): IAttackResult<DamageType>;

    protected onBeforeAttack(): IBeforeAttackResult | void { }
    protected onBeforeTakeHit(): IBeforeTakeHitResult | void { }
    protected onAfterTakeHit(_damage: Damage): IAfterTakeHitResult | void { }
    protected onAfterAttack(_damage: DamageType): IAfterAttackResult | void { }

    #modifyHP(delta: number, isGain: boolean = true)
    {
        delta = Utils.applySign(delta, isGain);
        this.#currentHP = Utils.clamp(this.#currentHP + delta, this.#maxHP);

        if (this.#currentHP <= 0)
            this.status = CharacterStatus.Dead;
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

        return report;
    }

    takeHit(damage: Damage): ITakeHitResult
    {
        this.onBeforeTakeHit();
        const beforeTakeHitEffects = this.#checkEffect(EffectTiming.BeforeTakeHit);

        damage.calculate();

        this.#modifyHP(damage.amount, false);
        if (damage instanceof AttackDamage)
            for (const dmg of damage.followUps)
                this.#modifyHP(dmg.amount, false);

        this.onAfterTakeHit(damage);
        const afterTakeHitEffects = this.#checkEffect(EffectTiming.AfterTakeHit);

        return {
            damage,
            [EffectTiming.BeforeTakeHit]: beforeTakeHitEffects,
            [EffectTiming.AfterTakeHit]: afterTakeHitEffects,
        };
    }

    modifyArmor(delta: number, isGain: boolean = true): number
    {
        delta = Utils.applySign(delta, isGain);
        this.#armor = Utils.clamp(this.#armor + delta);
        return this.#armor;
    }

    modifyPower(delta: number, isGain: boolean = true)
    {
        delta = Utils.applySign(delta, isGain);
        this.#power.min = Utils.clamp(this.#power.min + delta);
        this.#power.max = Utils.clamp(this.#power.max + delta);
    }

    heal(multiplier: number): Recovery
    {
        const recovery = new HealRecovery(this, multiplier);
        this.#modifyHP(recovery.amount);
        return recovery;
    }

    lifesteal(damage: number, multiplier: number): Recovery
    {
        const recovery = new LifestealRecovery(this, damage, multiplier);
        this.#modifyHP(recovery.amount);
        return recovery;
    }

    wound(power: number, multiplier: number)
    {
        const woundDamage = new WoundDamage(this, power, multiplier);
        this.#modifyHP(woundDamage.amount, false);
        return woundDamage;
    }

    receiveEffect(effect: Effect)
    {
        const existingEffect = this.getEffect(effect.id);

        if (existingEffect)
            existingEffect.update(effect);
        else
            this.effects.push(effect);
    }

    getEffect(id: string)
    {
        return this.effects.find(eft => eft.id === id);
    }

    removeEffect(id: string)
    {
        this.effects = this.effects.filter(eft => eft.id !== id);
    }

    #checkEffect(timing: EffectTiming): Effect[]
    {
        if (this.status === CharacterStatus.Dead)
            return [];

        const report = [];

        for (const eft of this.effects)
        {
            if (eft.applyTiming === timing)
            {
                eft.apply();
                report.push(eft.snapshot());
            }
            else if (eft.expireTiming === timing && eft.tryToExpire())
            {
                report.push(eft.snapshot());
                this.removeEffect(eft.id);
            }
        }

        return report;
    }
}