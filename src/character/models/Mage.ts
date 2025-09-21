import { Character } from "./Character";
import { CharacterBasics } from "./CharacterBasics";
import type { IAttackResult, ITalismanAbility } from "../types";
// damage
import { AttackDamage, TalismanDamage, WoundDamage } from "@/damage";
import type { ITalisman } from "@/damage/types";
// recovery
import type { Recovery } from "@/recovery";
// utils
import Utils from "@/utils";

export class Mage extends Character<AttackDamage> implements ITalismanAbility
{
    readonly id: string = Utils.generateId("mge");
    protected tag = "🧙‍♂️";

    readonly talisman: ITalisman = { power: 155, chance: 0.35 };
    readonly talismanWoundMultiplier = 0.25;
    readonly healMultiplier = 0.05;

    protected initBasics(): CharacterBasics
    {
        return new CharacterBasics(980, 2.5, { min: 178, max: 1182 });
    }

    onAttack(target: Character): IAttackResult<AttackDamage>
    {
        const recoveries: Recovery[] = [];
        const wounds: WoundDamage[] = [];

        const damage = new AttackDamage(this, target);

        const canTriggerTalisman = this.hp > this.talisman.power * this.talismanWoundMultiplier;
        const talismanDamage = new TalismanDamage(this, target);

        if (canTriggerTalisman && talismanDamage.isTriggerd)
        {
            damage.addFollowUp(talismanDamage);
            const woundDamage = this.wound(this.talisman.power, this.talismanWoundMultiplier);
            wounds.push(woundDamage);
        }
        else
        {
            const heal = this.heal(this.healMultiplier);
            recoveries.push(heal);
        }

        return { damage, recoveries, wounds };
    }
}