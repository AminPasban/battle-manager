import type { RecoveryType } from "../enums";
import type { RecoveryMetadata } from "../types";
// character
import type { Character } from "@/character";

export abstract class Recovery
{
    readonly abstract amount: number;
    readonly abstract type: RecoveryType;
    readonly abstract targetHPAfterRecovery: number;
    readonly target: Character;
    readonly targetHPBeforeRecovery: number;
    readonly metadata: RecoveryMetadata = { color: "#008000" };

    constructor(target: Character)
    {
        this.target = target;
        this.targetHPBeforeRecovery = target.hp;
    }
}