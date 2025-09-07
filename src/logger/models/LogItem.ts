import { LogLine } from "./LogLine";
// effect
import { EffectTiming } from "@/effect/enums";
import { EffectUtils } from "@/effect/utils";
import type { IEffectReport } from "@/effect/types";

export class LogItem
{
    readonly element = document.createElement("div");
    lines: LogLine[] = [];

    constructor(logLine?: LogLine)
    {
        this.element.className = "log-item";

        if (logLine)
            this.element.append(logLine.element);
    }

    appendLine(logLine: LogLine)
    {
        this.lines.push(logLine);
        this.element.append(logLine.element);
    }

    getLastLine()
    {
        return this.lines[this.lines.length - 1];
    }

    static createEffectItem(report: IEffectReport, ...timings: EffectTiming[])
    {
        const logItem = new LogItem();
        const effects = EffectUtils.filterEffectReport(report, ...timings);
        for (const eft of effects)
        {
            const line = LogLine.createEffectLine(eft);
            logItem.appendLine(line);
        }

        return logItem;
    }
}