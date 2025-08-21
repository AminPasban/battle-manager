import type { Character } from "../character";
import type { AttackDamage, TalismanDamage, WoundDamage } from "../damage";
import { type Recovery } from "../recovery";

export type LogTextEl = HTMLSpanElement;

export class LogText
{
    readonly element: LogTextEl = document.createElement("span");

    constructor()
    {
        this.element.className = "log-text";
    }

    private addSpan(text: string, color: string)
    {
        const span = document.createElement("span");
        span.style.color = color;
        span.append(text)
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

        return this.element;
    }

    winner(player: Character)
    {
        this.clear();
        this.element.append(`${player.name} wins (${player.hp} HP)`);
        return this.element;
    }

    attack(damage: AttackDamage)
    {
        this.clear();
        this.element.append(`${damage.source.name} `);

        const { critMultiplier } = damage.specialEffects
        this.addSpan(
            critMultiplier ? `${damage.amount} CRIT-DMG (x${critMultiplier}) ` : `${damage.amount} DMG `,
            damage.metadata.color
        );

        this.element.append(`=> ${damage.target.name} `);
        this.appendHPChange(damage.targetHPBeforeDamage, damage.targetHPAfterDamage);

        return this.element;
    }

    talisman(damage: TalismanDamage)
    {
        this.clear();

        this.element.append(`${damage.source.name} `);
        this.addSpan(`${damage.amount} TALISMAN-DMG `, damage.metadata.color);
        this.element.append(`=> ${damage.target.name} `);
        this.appendHPChange(damage.targetHPBeforeDamage, damage.targetHPAfterDamage);

        return this.element;
    }

    wound(damage: WoundDamage)
    {
        this.clear();

        this.element.append(`${damage.target.name} `);
        this.addSpan(`-${damage.amount} Wounded `, damage.metadata.color);
        this.appendHPChange(damage.targetHPBeforeDamage, damage.targetHPAfterDamage);

        return this.element;
    }

    recovery(recovery: Recovery)
    {
        this.clear();

        this.element.append(`${recovery.target.name} `);
        this.addSpan(`+${recovery.amount} ${recovery.type}ed `, recovery.metadata.color)
        this.appendHPChange(recovery.targetHPBeforeRecovery, recovery.targetHPAfterRecovery);

        return this.element;
    }
}