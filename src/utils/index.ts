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

    static clamp(value: number, max: number, min: number = 0): number
    {
        return Math.max(min, Math.min(value, max));
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
}