import { Damage } from "./Damage";
import type { Character } from "../character";
import Utils from "../../utils";
import { DamageType } from "./enums";
import type { IDamageMetadata } from "./types";

export class TalismanDamage extends Damage
{
    readonly type: DamageType = DamageType.Talisman;
    readonly metadata: IDamageMetadata = { color: "#7F00FF" };

    readonly amount: number = 0;
    readonly targetHPAfterDamage: number;

    constructor(source: Character, target: Character, power: number)
    {
        super(source, target);
        this.amount = power;
        this.targetHPAfterDamage = Utils.clamp(this.targetHPBeforeDamage - this.amount, target.maxHP);
    }
}