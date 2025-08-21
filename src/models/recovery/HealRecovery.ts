import { Recovery, RecoveryType } from "./Recovery";
import type { Character } from "../character";
import Utils from "../../utils";

export class HealRecovery extends Recovery
{
    amount: number;
    type: RecoveryType = RecoveryType.Heal;
    targetHPAfterRecovery: number;

    constructor(target: Character, multiplier: number)
    {
        super(target);
        this.amount = Math.round(target.maxHP * multiplier);
        this.targetHPAfterRecovery = Utils.clamp(this.targetHPBeforeRecovery + this.amount, target.maxHP);
    }
}