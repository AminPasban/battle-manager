import type { ILogTextEl } from "./types";
// battle manager
import type { ISimulateFightsResult, ISimulateFightsStat } from "@/battle-manager/types";
// character
import type { Character } from "@/character";
// damage
import type { AttackDamage, TalismanDamage, WoundDamage } from "@/damage";
// recovery
import { type Recovery } from "@/recovery";

export class LogText
{
    readonly element: ILogTextEl = document.createElement("span");

    constructor()
    {
        this.element.className = "log-text";
    }

    private addSpan(text: string, color: string)
    {
        const span = document.createElement("span");
        span.style.color = color;
        span.append(text);
        this.element.appendChild(span);
    }

    private appendHPChange(before: number, after: number)
    {
        this.element.append(`(${before} => ${after} HP)`);
    }

    private clear()
    {
        this.element.replaceChildren();
    }

    start(player1: Character, player2: Character)
    {
        this.clear();

        this.element.append(`${player1.name} (${player1.hp} HP) `);
        this.element.append("----- VS ----- ");
        this.element.append(`${player2.name} (${player2.hp} HP)`);

        return this.element.cloneNode(true) as HTMLSpanElement;
    }

    winner(player: Character)
    {
        this.clear();
        this.element.append(`${player.name} wins (${player.hp} HP)`);
        return this.element.cloneNode(true) as HTMLSpanElement;
    }

    attack(damage: AttackDamage)
    {
        this.clear();
        this.element.append(`${damage.source.name} `);

        const { critMultiplier } = damage.specialEffects;
        this.addSpan(
            critMultiplier ? `${damage.amount} CRIT-DMG (x${critMultiplier}) ` : `${damage.amount} DMG `,
            damage.metadata.color
        );

        this.element.append(`=> ${damage.target.name} `);
        this.appendHPChange(damage.targetHPBeforeDamage, damage.targetHPAfterDamage);

        return this.element.cloneNode(true) as HTMLSpanElement;
    }

    talisman(damage: TalismanDamage)
    {
        this.clear();
        this.element.append(`${damage.source.name} `);
        this.addSpan(`${damage.amount} TALISMAN-DMG `, damage.metadata.color);
        this.element.append(`=> ${damage.target.name} `);
        this.appendHPChange(damage.targetHPBeforeDamage, damage.targetHPAfterDamage);

        return this.element.cloneNode(true) as HTMLSpanElement;
    }

    wound(damage: WoundDamage)
    {
        this.clear();
        this.element.append(`${damage.target.name} `);
        this.addSpan(`-${damage.amount} Wounded `, damage.metadata.color);
        this.appendHPChange(damage.targetHPBeforeDamage, damage.targetHPAfterDamage);

        return this.element.cloneNode(true) as HTMLSpanElement;
    }

    recovery(recovery: Recovery)
    {
        this.clear();
        this.element.append(`${recovery.target.name} `);
        this.addSpan(`+${recovery.amount} ${recovery.type}ed `, recovery.metadata.color);
        this.appendHPChange(recovery.targetHPBeforeRecovery, recovery.targetHPAfterRecovery);

        return this.element.cloneNode(true) as HTMLSpanElement;
    }

    simulateFights({ fights, stats }: ISimulateFightsResult)
    {
        this.clear();
        this.element.append(`${stats[0].name} ----- ${fights} fights ----- ${stats[1].name}`);
        return this.element.cloneNode(true) as HTMLSpanElement;
    }

    simulateStat(stat: ISimulateFightsStat)
    {
        this.clear();
        this.element.append(`${stat.name} ${stat.wins} wins (${stat.rate}%)`);
        return this.element.cloneNode(true) as HTMLSpanElement;
    }
}