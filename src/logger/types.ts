export interface ILoggerOptions
{
    container?: HTMLDivElement | null;
    isQueueEnabled?: boolean;
    queueDelayMS?: number;
    autoScroll?: boolean;
}

export interface ILogLineOptions
{
    centered?: boolean;
    indented?: boolean;
}