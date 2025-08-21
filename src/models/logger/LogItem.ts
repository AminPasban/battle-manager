import type { LogTextEl } from "./LogText";

export interface LogItemOptions
{
    color?: string;
    centered?: boolean;
}

export class LogItem
{
    public readonly element: HTMLDivElement = document.createElement("div");
    private options?: LogItemOptions;

    constructor(textEl?: LogTextEl, options?: LogItemOptions)
    {
        this.element.className = "log-item";
        this.options = options;

        if (textEl)
            this.appendLogLine(textEl, options);
    }

    appendLogLine(textEl: LogTextEl, options?: LogItemOptions)
    {
        let opts = options ?? this.options;

        const logLine = this.createLogLine(textEl, opts);
        this.element.appendChild(logLine);
    }

    appendComboLogLine(textEls: LogTextEl[], options?: LogItemOptions[])
    {
        if (textEls.length === 1)
        {
            this.appendLogLine(textEls[0], options?.[0]);
            return;
        }

        for (let i = 0; i < textEls.length; i++)
        {
            const lineEl = this.createLogLine(textEls[i], options?.[i], true);
            this.element.appendChild(lineEl);
        }

        const comboEl = document.createElement("div");
        comboEl.classList.add("log-combo");
        comboEl.append(`${textEls.length}X`);
        comboEl.style.height = textEls.length * 28 + (textEls.length - 1) * 2 + "px";

        this.getLastLogLine()?.appendChild(comboEl);
    }

    createLogLine(textEl: LogTextEl, opts?: LogItemOptions, combo?: boolean)
    {
        const lineEl = document.createElement("div")
        lineEl.classList.add("log-line");
        if (opts?.centered)
            lineEl.classList.add("log-line-center");
        if (combo)
            lineEl.classList.add("log-line-combo");

        lineEl.appendChild(textEl);

        if (opts?.color)
        {
            const colorEl = document.createElement("div")
            colorEl.classList.add("log-color");
            colorEl.style.backgroundColor = opts.color;
            lineEl.appendChild(colorEl);
        }

        return lineEl;
    }

    getLastLogLine()
    {
        return this.element.lastElementChild;
    }
}