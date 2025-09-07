import type { LogItem } from "./LogItem";

export class LogGroup
{
    public readonly element = document.createElement("div");

    constructor(...logItems: LogItem[])
    {
        this.element.className = "log-group";

        for (const item of logItems)
            this.appendItem(item);
    }

    appendItem(logItem: LogItem)
    {
        if (logItem.lines.length > 0)
            this.element.append(logItem.element);
    }
}