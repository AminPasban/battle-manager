import { Damage, DamageType, type DamageMetadata } from "./Damage";
import type { Character } from "../character";
import Utils from "../../utils";

export class WoundDamage extends Damage
{
    readonly type: DamageType = DamageType.Wound;
    readonly metadata: DamageMetadata = { color: "#DC5F00" };

    readonly amount: number = 0;
    readonly targetHPAfterDamage: number;

    constructor(character: Character, power: number, multiplier: number)
    {
        super(character, character);

        this.amount = Math.round(power * multiplier);
        this.targetHPAfterDamage = Utils.clamp(this.targetHPBeforeDamage - this.amount, character.maxHP);
    }
}