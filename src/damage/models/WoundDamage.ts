import { Damage } from "./Damage";
import { DamageType } from "../enums";
import type { IDamageMetadata } from "../types";
// character
import { Character } from "@/character";
// utils
import Utils from "@/utils";

export class WoundDamage extends Damage
{
    readonly type: DamageType = DamageType.Wound;
    readonly source: Character;
    readonly metadata: IDamageMetadata = { color: "#DC5F00" };

    constructor(target: Character, power: number, multiplier: number)
    {
        super(target);
        this.source = target;

        this.amount = Math.round(power * multiplier);
        this.targetHPAfterDamage = Utils.clamp(this.targetHPBeforeDamage - this.amount);
    }

    calculate(): void { }
}