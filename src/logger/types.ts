export interface ILoggerOptions
{
    container?: HTMLDivElement | null;
    autoScroll?: boolean;
}

export interface ILogItemBadge
{
    color: string;
    position: "start" | "end" | "both";
}

export interface ILogItemOptions
{
    badge?: ILogItemBadge;
    centered?: boolean;
}

export type ILogTextEl = HTMLSpanElement;