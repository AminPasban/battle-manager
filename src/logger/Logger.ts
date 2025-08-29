import { LogItem } from "./LogItem";
import { LogText } from "./LogText";
import type { ILoggerOptions, ILogItemBadge, ILogItemOptions } from "./types";
// battle manager
import type { ISimulateFightsResult } from "@/battle-manager/types";
// character
import { Character } from "@/character";
import type { IAttackReport } from "@/character/types";
// damage
import { AttackDamage, Damage, TalismanDamage, WoundDamage } from "@/damage";

export class Logger
{
    private container: HTMLElement | null = document.getElementById("log");
    private autoScroll: boolean;

    constructor(opts: ILoggerOptions = {})
    {
        this.container = opts.container ?? document.getElementById("log");
        this.autoScroll = opts.autoScroll ?? true;
    }

    clear()
    {
        this.container?.replaceChildren();
    }

    private _assertNever(x: never): never
    {
        throw new Error(`Unhandled damage type: ${(x as any)?.type}`);
    }

    private _append(...items: LogItem[])
    {
        if (!this.container) return;

        for (const item of items)
            this.container.append(item.element);

        if (!this.autoScroll) return;

        requestAnimationFrame(() =>
        {
            this.container!.scrollTop = this.container!.scrollHeight;
        });
    }

    private _flatDamages(damages: Damage[])
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
    }

    logStart(player1: Character, player2: Character)
    {
        const textEl = new LogText().start(player1, player2);
        const logItem = new LogItem(textEl, { centered: true });
        this._append(logItem);
    }

    logWinner(player: Character)
    {
        const textEl = new LogText().winner(player);
        const logItem = new LogItem(textEl, { centered: true });
        this._append(logItem);
    }

    logAttack({ damages, recoveries }: IAttackReport)
    {
        const flatDamages = this._flatDamages(damages);
        const logItem = new LogItem();

        const getOptions = (damage: Damage): ILogItemOptions =>
        {
            return { badge: { color: damage.metadata.color, position: "start" } };
        };

        for (const damage of flatDamages)
        {
            if (Array.isArray(damage))
            {
                const textEls: HTMLSpanElement[] = [];
                const options: ILogItemOptions[] = [];
                for (const dmg of damage)
                {
                    textEls.push(new LogText().attack(dmg));
                    options.push(getOptions(dmg));
                }
                logItem.appendComboLogLine(textEls, options);
            }
            else if (damage instanceof AttackDamage)
            {
                const textEl = new LogText().attack(damage);
                logItem.appendLogLine(textEl, getOptions(damage));
            }
            else if (damage instanceof TalismanDamage)
            {
                const textEl = new LogText().talisman(damage);
                logItem.appendLogLine(textEl, getOptions(damage));
            }
            else if (damage instanceof WoundDamage)
            {
                const textEl = new LogText().wound(damage);
                logItem.appendLogLine(textEl, getOptions(damage));
            }
            else
            {
                this._assertNever(damage.type as never);
            }
        }

        if (recoveries?.length)
        {
            for (const rec of recoveries)
            {
                const textEl = new LogText().recovery(rec);
                logItem.appendLogLine(textEl, { badge: { color: rec.metadata.color, position: "start" } });
            }
        }

        this._append(logItem);
    }

    logSimulate({ stats, fights }: ISimulateFightsResult)
    {
        const logText = new LogText();

        this._append(new LogItem(
            logText.simulateFights({ stats, fights }),
            { centered: true }
        ));

        const badge: ILogItemBadge = { color: "red", position: "both" };

        this._append(new LogItem(
            logText.simulateStat(stats[0]),
            { centered: true, badge: stats[0].rate > 50 ? badge : undefined }
        ));

        this._append(new LogItem(
            logText.simulateStat(stats[1]),
            { centered: true, badge: stats[1].rate > 50 ? badge : undefined }
        ));
    }
}
