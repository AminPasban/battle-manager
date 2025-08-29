import type { ILogItemOptions, ILogTextEl } from "../types";

export class LogItem
{
    public readonly element: HTMLDivElement = document.createElement("div");
    private options?: ILogItemOptions;

    constructor(textEl?: ILogTextEl, options?: ILogItemOptions)
    {
        this.element.className = "log-item";
        this.options = options;

        if (textEl)
            this.appendLogLine(textEl, options);
    }

    appendLogLine(textEl: ILogTextEl, options?: ILogItemOptions)
    {
        let opts = options ?? this.options;

        const logLine = this.createLogLine(textEl, opts);
        this.element.appendChild(logLine);
    }

    appendComboLogLine(textEls: ILogTextEl[], options?: ILogItemOptions[])
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

    createLogLine(textEl: ILogTextEl, opts?: ILogItemOptions, combo?: boolean)
    {
        const lineEl = document.createElement("div");
        lineEl.classList.add("log-line");
        if (opts?.centered)
            lineEl.classList.add("log-line-center");
        if (combo)
            lineEl.classList.add("log-line-combo");

        lineEl.appendChild(textEl);

        if (opts?.badge)
        {
            const { color, position } = opts.badge;

            if (position === "start" || position === "both")
            {
                const badgeEl = this.createBadgeEl(color);
                badgeEl.classList.add("log-badge-start");
                lineEl.appendChild(badgeEl);
            }
            if (position === "end" || position === "both") {
                const badgeEl = this.createBadgeEl(color);
                badgeEl.classList.add("log-badge-end");
                lineEl.appendChild(badgeEl);
            }
        }

        return lineEl;
    }

    createBadgeEl(color: string)
    {
        const badgeEl = document.createElement("div");
        badgeEl.classList.add("log-badge");
        badgeEl.style.backgroundColor = color;

        return badgeEl;
    }

    getLastLogLine()
    {
        return this.element.lastElementChild;
    }
}