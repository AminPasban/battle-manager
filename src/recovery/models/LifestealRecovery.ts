import { Recovery } from "./Recovery";
import { RecoveryType } from "../enums";
// character
import { Character } from "@/character";
// utils
import Utils from "@/utils";

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