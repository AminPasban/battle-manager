// battle manager
import type { ISimulationFighterStats, ISimulationSummary } from "@/battle-manager/types";
// character
import type { Character } from "@/character";
// damage
import type { AttackDamage, TalismanDamage, WoundDamage } from "@/damage";
// recovery
import { type Recovery } from "@/recovery";
// effect
import type { Effect } from "@/effect";

export class LogText
{
    readonly element = document.createElement("span");

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

    start(player1: Character, player2: Character)
    {
        this.element.append(`${player1.name} (${player1.hp} HP) `);
        this.element.append("----- VS ----- ");
        this.element.append(`${player2.name} (${player2.hp} HP)`);

        return this;
    }

    winner(player: Character)
    {
        this.element.append(`${player.name} wins (${player.hp} HP)`);
        return this;
    }

    attack(damage: AttackDamage)
    {
        this.element.append(`${damage.source.name} `);

        const { critMultiplier } = damage.specialEffects;
        this.addSpan(
            critMultiplier ? `${damage.amount} CRIT-DMG (x${critMultiplier}) ` : `${damage.amount} DMG `,
            damage.metadata.color
        );

        this.element.append(`=> ${damage.target.name} `);
        this.appendHPChange(damage.targetHPBeforeDamage, damage.targetHPAfterDamage);

        return this;
    }

    talisman(damage: TalismanDamage)
    {
        this.element.append(`${damage.source.name} `);
        this.addSpan(`${damage.amount} TALISMAN-DMG `, damage.metadata.color);
        this.element.append(`=> ${damage.target.name} `);
        this.appendHPChange(damage.targetHPBeforeDamage, damage.targetHPAfterDamage);

        return this;
    }

    wound(damage: WoundDamage)
    {
        this.element.append(`${damage.target.name} `);
        this.addSpan(`-${damage.amount} Wounded `, damage.metadata.color);
        this.appendHPChange(damage.targetHPBeforeDamage, damage.targetHPAfterDamage);

        return this;
    }

    recovery(recovery: Recovery)
    {
        this.element.append(`${recovery.target.name} `);
        this.addSpan(`+${recovery.amount} ${recovery.type} `, recovery.metadata.color);
        this.appendHPChange(recovery.targetHPBeforeRecovery, recovery.targetHPAfterRecovery);

        return this;
    }

    effect(effect: Effect)
    {
        const operator = (effect.isPositive && !effect.isExpired) || (!effect.isPositive && effect.isExpired) ? "+" : "-";

        this.element.append(`${effect.target.name} `);
        this.addSpan(`${operator}${effect.intensity} ${effect.type} `, effect.metadata.color);
        this.element.append(`(${effect.orginalValue} => ${effect.resultingValue} ${effect.type})`);

        return this;
    }

    simulationSummary({ fights, stats }: ISimulationSummary)
    {
        this.element.append(stats[0].name);
        this.element.append(` ----- ${fights} fights ----- `);
        this.element.append(stats[1].name);
        return this;
    }

    simulationFighterStats(stats: ISimulationFighterStats)
    {
        this.element.append(`${stats.name} ${stats.wins} wins (${stats.rate}%)`);
        return this;
    }
}