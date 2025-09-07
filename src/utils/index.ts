export default class Utils
{
    static randomInRange(min: number, max: number): number
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static isLucky(chance: number): boolean
    {
        return chance >= Math.random();
    }

    static clamp(value: number, max: number = Infinity, min: number = 0): number
    {
        return Math.max(min, Math.min(value, max));
    }

    static snapshot<T extends Record<string, any>>(obj: T): T
    {
        return { ...obj };
    }

    static generateId(length: number = 6): string
    {
        const chars = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let id = "";
        for (let i = 0; i < length; i++)
        {
            const randomIndex = Math.floor(Math.random() * chars.length);
            id += chars[randomIndex];
        }
        return id;
    }

    static pruneEmpty<T extends Record<string, any>>(obj: T): T
    {
        for (const key in obj)
        {
            const value = obj[key];

            if (value == null)
            {
                delete obj[key];
                continue;
            }

            if (Array.isArray(value))
            {
                obj[key] = value.filter((x: unknown) => x);
                continue;
            }

            if (typeof value === "object")
            {
                this.pruneEmpty(value);

                if (Object.keys(value).length === 0)
                    delete obj[key];
            }
        }

        return obj;
    };
}