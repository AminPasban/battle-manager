import type { Damage } from "./models/Damage";
import { AttackDamage } from "./models/AttackDamage";

export class DamageUtils
{
    static flat(damages: Damage[])
    {
        const flatArray = [];

        for (const dmg of damages)
        {
            if (!(dmg instanceof AttackDamage) || dmg.followUps.length === 0)
            {
                flatArray.push(dmg);
                continue;
            }

            const combo = [dmg];
            flatArray.push(combo);
            for (const d of dmg.followUps)
                (d instanceof AttackDamage) ? combo.push(d) : flatArray.push(d);
        }

        return flatArray;
    };
}