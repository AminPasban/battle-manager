import { LogGroup } from "./LogGroup";
import { LogItem } from "./LogItem";
import { LogLine } from "./LogLine";
import { LogText } from "./LogText";
import { LogBadgePosition } from "../enum";
import type { ILoggerOptions } from "../types";
// battle manager
import type { ISimulationSummary } from "@/battle-manager/types";
// character
import { Character } from "@/character";
import type { IAttackReport } from "@/character/types";
// damage
import { DamageUtils } from "@/damage/utils";
// effect
import { EffectTiming } from "@/effect/enums";

export class Logger
{
    private container: HTMLElement | null = document.getElementById("log");
    private autoScroll: boolean;

    constructor(opts: ILoggerOptions = {})
    {
        this.container = opts.container ?? this.container;
        this.autoScroll = opts.autoScroll ?? true;
    }

    clear()
    {
        this.container?.replaceChildren();
    }

    #append(...items: (LogItem | LogGroup)[])
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
        const logText = new LogText().start(player1, player2);
        const logLine = new LogLine(logText, { centered: true });
        const logItem = new LogItem(logLine);
        this.#append(logItem);
    }

    logWinner(player: Character)
    {
        const logText = new LogText().winner(player);
        const logLine = new LogLine(logText, { centered: true });
        const logItem = new LogItem(logLine);
        this.#append(logItem);
    }

    logAttack({ damages, recoveries, effects }: IAttackReport)
    {
        const beforeLogItem = LogItem.createEffectItem(effects, EffectTiming.BeforeAttack, EffectTiming.BeforeTakeHit);

        const mainLogItem = new LogItem();

        for (const damage of DamageUtils.flat(damages))
        {
            if (Array.isArray(damage))
                for (const line of LogLine.createComboLines(damage))
                    mainLogItem.appendLine(line);
            else 
            {
                const line = LogLine.createDamageLine(damage);
                mainLogItem.appendLine(line);
            }
        }

        for (const rec of recoveries)
        {
            const line = LogLine.createRecoveryLine(rec);
            mainLogItem.appendLine(line);
        }

        const afterLogItem = LogItem.createEffectItem(effects, EffectTiming.AfterTakeHit, EffectTiming.AfterAttack);

        const logGroup = new LogGroup(beforeLogItem, mainLogItem, afterLogItem);

        this.#append(logGroup);
    }

    logSimulation(summary: ISimulationSummary)
    {
        const logText = new LogText().simulationSummary(summary);
        const logLine = new LogLine(logText, { centered: true });
        const logItem = new LogItem(logLine);
        this.#append(logItem);

        for (const stat of summary.stats)
        {
            const logText = new LogText().simulationFighterStats(stat);
            const logLine = new LogLine(logText, { centered: true });

            if (stat.rate > 50)
                logLine.appendBadge("red", LogBadgePosition.Both);

            const logItem = new LogItem(logLine);

            this.#append(logItem);
        }
    }
}