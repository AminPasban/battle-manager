import { LogText } from "./LogText";
import { LogItem } from "./LogItem";
import type { AttackResult, Character } from "../character";
import { AttackDamage, TalismanDamage, WoundDamage } from "../damage";

function assertNever(x: never): never
{
    throw new Error(`Unhandled damage type: ${(x as any)?.type}`)
}

export interface LoggerOptions
{
    container?: HTMLDivElement | null;
    autoScroll?: boolean;
}

export class Logger
{
    private container: HTMLElement | null = document.getElementById("log");
    private autoScroll: boolean;

    constructor(opts: LoggerOptions = {})
    {
        this.container = opts.container ?? document.getElementById("log")
        this.autoScroll = opts.autoScroll ?? true;
    }

    clear()
    {
        this.container?.replaceChildren();
    }

    private append(item: LogItem)
    {
        if (!this.container) return;

        this.container.append(item.element)

        if (!this.autoScroll) return;

        requestAnimationFrame(() =>
        {
            this.container!.scrollTop = this.container!.scrollHeight;
        })
    }

    logStart(player1: Character, player2: Character)
    {
        const textEl = new LogText().start(player1, player2);
        const logItem = new LogItem(textEl, { centered: true });
        this.append(logItem);
    }

    logWinner(player: Character)
    {
        const textEl = new LogText().winner(player)
        const logItem = new LogItem(textEl, { centered: true });
        this.append(logItem);
    }

    logAttack({ damages, recoveries }: AttackResult)
    {
        const logItem = new LogItem();

        for (const damage of damages)
        {
            if (damage instanceof AttackDamage)
            {
                const attackDamages = [damage, ...damage.followUpDamages];
                const textEls = attackDamages.map(dmg => new LogText().attack(dmg))
                const options = attackDamages.map(dmg => ({ color: dmg.metadata.color }))
                logItem.appendComboLogLine(textEls, options);
            }
            else if (damage instanceof TalismanDamage)
            {
                const textEl = new LogText().talisman(damage)
                logItem.appendLogLine(textEl, { color: damage.metadata.color });
            }
            else if (damage instanceof WoundDamage)
            {
                const textEl = new LogText().wound(damage)
                logItem.appendLogLine(textEl, { color: damage.metadata.color });
            }
            else
            {
                assertNever(damage.type as never);
            }
        }

        if (recoveries?.length)
        {
            for (const rec of recoveries)
            {
                const textEl = new LogText().recovery(rec)
                logItem.appendLogLine(textEl, { color: rec.metadata.color })
            }
        }

        this.append(logItem);
    }
}
