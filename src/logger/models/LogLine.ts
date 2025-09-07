import { LogText } from "./LogText";
import { LogBadgePosition } from "../enum";
import type { ILogLineOptions } from "../types";
// damage
import { AttackDamage, TalismanDamage, WoundDamage, Damage } from "@/damage";
// effect
import type { Effect } from "@/effect";
import type { Recovery } from "@/recovery";

export class LogLine
{
    readonly element = document.createElement("div");
    options: ILogLineOptions | undefined;

    constructor(logText?: LogText, options?: ILogLineOptions)
    {
        this.options = options;
        this.element.className = "log-line";

        if (logText)
            this.appendText(logText);

        if (options?.centered)
            this.element.classList.add("log-line-center");
        if (options?.indented)
            this.element.classList.add("log-line-indented");
    }

    #createBadgeEl(color: string, className: string)
    {
        const badgeEl = document.createElement("div");
        badgeEl.classList.add("log-badge", className);
        badgeEl.style.backgroundColor = color;

        return badgeEl;
    }

    appendText(logText: LogText)
    {
        this.element.append(logText.element);
    }

    appendBadge(color: string, position: LogBadgePosition)
    {
        if (position === LogBadgePosition.Start || position === LogBadgePosition.Both)
        {
            const badgeEl = this.#createBadgeEl(color, "log-badge-start");
            this.element.append(badgeEl);
        }

        if (position === LogBadgePosition.End || position === LogBadgePosition.Both)
        {
            const badgeEl = this.#createBadgeEl(color, "log-badge-end");
            this.element.append(badgeEl);
        }
    }

    appendCombo(count: number)
    {
        const comboEl = document.createElement("div");
        comboEl.style.height = count * 28 + (count - 1) * 2 + "px";
        comboEl.classList.add("log-combo");
        comboEl.append(count + "X");

        this.element.append(comboEl);
    }

    appendEffectIcon(isExpired: boolean)
    {
        const effectEl = document.createElement("div");
        effectEl.className = isExpired ? "log-effect log-effect-expired" : "log-effect";
        effectEl.append("✨");

        this.element.append(effectEl);
    }

    static createDamageLine(damage: Damage)
    {
        const logLine = new LogLine();
        logLine.appendBadge(damage.metadata.color, LogBadgePosition.Start);

        let logText: LogText | null = null;

        if (damage instanceof AttackDamage)
        {
            logText = new LogText().attack(damage);
        }
        else if (damage instanceof TalismanDamage)
        {
            logText = new LogText().talisman(damage);
        }
        else if (damage instanceof WoundDamage)
        {
            logText = new LogText().wound(damage);
        }
        else
            throw new Error(`Unhandled damage type: ${(damage as any)?.type}`);

        logLine.appendText(logText);

        return logLine;
    }

    static createComboLines(damages: AttackDamage[])
    {
        const lines: LogLine[] = [];

        for (const dmg of damages)
        {
            const logText = new LogText().attack(dmg);
            const logLine = new LogLine(logText, { indented: true });
            logLine.appendBadge(dmg.metadata.color, LogBadgePosition.Start);
            lines.push(logLine);
        }

        lines[lines.length - 1].appendCombo(damages.length);

        return lines;
    }

    static createRecoveryLine(recovery: Recovery)
    {
        const logText = new LogText().recovery(recovery);
        const logLine = new LogLine(logText);
        logLine.appendBadge(recovery.metadata.color, LogBadgePosition.Start);

        return logLine;
    }

    static createEffectLine(effect: Effect)
    {
        const logText = new LogText().effect(effect);

        const logLine = new LogLine(logText, { indented: true });
        logLine.appendBadge(effect.metadata.color, LogBadgePosition.Start);
        logLine.appendEffectIcon(effect.isExpired);

        return logLine;
    }
}