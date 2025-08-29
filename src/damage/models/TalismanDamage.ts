import { Damage } from "./Damage";
import { DamageType } from "../enums";
import type { IDamageMetadata } from "../types";
// character
import { Character } from "@/character";
import type { ITalismanAbility } from "@/character/types";
// utils
import Utils from "@/utils";

export class TalismanDamage extends Damage
{
    readonly type: DamageType = DamageType.Talisman;
    readonly isTriggerd: boolean = false;
    readonly source: Character & ITalismanAbility;
    readonly metadata: IDamageMetadata = { color: "#7F00FF" };

    constructor(source: Character & ITalismanAbility, target: Character)
    {
        super(target);
        this.source = source;

        if (Utils.isLucky(source.talisman.chance))
        {
            this.isTriggerd = true;
            this.amount = this.source.talisman.power;
            this.targetHPAfterDamage = Utils.clamp(this.targetHPBeforeDamage - this.amount);
        }
    }

    calculate(): void { }
}