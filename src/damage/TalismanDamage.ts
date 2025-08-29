import { Damage } from "./Damage";
import type { Character, ITalismanAbility } from "@/character";
import Utils from "@/utils";
import { DamageType } from "./enums";
import type { IDamageMetadata } from "./types";

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