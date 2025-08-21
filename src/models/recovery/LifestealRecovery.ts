import { Recovery, RecoveryType } from "./Recovery";
import type { Character } from "../character";
import Utils from "../../utils";

export class LifestealRecovery extends Recovery
{
    amount: number;
    type = RecoveryType.Lifesteal;
    targetHPAfterRecovery: number;

    constructor(target: Character, damage: number, multiplier: number)
    {
        super(target);
        this.amount = Math.round(damage * multiplier);
        this.targetHPAfterRecovery = Utils.clamp(this.targetHPBeforeRecovery + this.amount, target.maxHP);
    }
}