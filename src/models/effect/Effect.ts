import type { Character } from "../character";

export abstract class Effect
{
    protected target: Character;
    protected value: number;
    readonly isPositive: boolean;

    constructor(target: Character, value: number, isPositive: boolean = true)
    {
        this.target = target;
        this.value = value;
        this.isPositive = isPositive;
    }

    abstract apply(): void;
    abstract expire(): void;
}