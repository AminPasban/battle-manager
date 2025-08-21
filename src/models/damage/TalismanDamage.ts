import { Damage, DamageType, type DamageMetadata } from "./Damage";
import type { Character } from "../character";
import Utils from "../../utils";

export class TalismanDamage extends Damage
{
    readonly type: DamageType = DamageType.Talisman;
    readonly metadata: DamageMetadata = { color: "#7F00FF" }

    readonly amount: number = 0;
    readonly targetHPAfterDamage: number;

    constructor(source: Character, target: Character, power: number)
    {
        super(source, target);
        this.amount = power;
        this.targetHPAfterDamage = Utils.clamp(this.targetHPBeforeDamage - this.amount, target.maxHP);
    }
}