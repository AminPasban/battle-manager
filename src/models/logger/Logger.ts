import type { Character, IAttackResult } from "../character";
import { AttackDamage, TalismanDamage, WoundDamage } from "../damage";
import type { ISimulateFightsResult } from "../battle-manager";
import { LogItem } from "./LogItem";
import { LogText } from "./LogText";
import { type ILoggerOptions, type ILogItemBadge, type ILogItemOptions } from "./types";

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

    private assertNever(x: never): never
    {
        throw new Error(`Unhandled damage type: ${(x as any)?.type}`);
    }

    private append(...items: LogItem[])
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

    logStart(player1: Character, player2: Character)
    {
        const textEl = new LogText().start(player1, player2);
        const logItem = new LogItem(textEl, { centered: true });
        this.append(logItem);
    }

    logWinner(player: Character)
    {
        const textEl = new LogText().winner(player);
        const logItem = new LogItem(textEl, { centered: true });
        this.append(logItem);
    }

    logAttack({ damages, recoveries }: IAttackResult)
    {
        const logItem = new LogItem();

        for (const damage of damages)
        {
            if (damage instanceof AttackDamage)
            {
                const attackDamages = [damage, ...damage.followUpDamages];
                const textEls = attackDamages.map(dmg => new LogText().attack(dmg));
                const options: ILogItemOptions[] = attackDamages.map(dmg => ({
                    badge: { color: dmg.metadata.color, position: "start" }
                }));
                logItem.appendComboLogLine(textEls, options);
            }
            else if (damage instanceof TalismanDamage)
            {
                const textEl = new LogText().talisman(damage);
                logItem.appendLogLine(textEl, { badge: { color: damage.metadata.color, position: "start" } });
            }
            else if (damage instanceof WoundDamage)
            {
                const textEl = new LogText().wound(damage);
                logItem.appendLogLine(textEl, { badge: { color: damage.metadata.color, position: "start" } });
            }
            else
            {
                this.assertNever(damage.type as never);
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

        this.append(logItem);
    }

    logSimulate({ stats, fights }: ISimulateFightsResult)
    {
        const logText = new LogText();

        this.append(new LogItem(
            logText.simulateFights({ stats, fights }),
            { centered: true }
        ));

        const badge: ILogItemBadge = { color: "red", position: "both" };

        this.append(new LogItem(
            logText.simulateStat(stats[0]),
            { centered: true, badge: stats[0].rate > 50 ? badge : undefined }
        ));

        this.append(new LogItem(
            logText.simulateStat(stats[1]),
            { centered: true, badge: stats[1].rate > 50 ? badge : undefined }
        ));
    }
}
