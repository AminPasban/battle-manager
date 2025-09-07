import type { ICharacterBasicPower } from "../types";

export class CharacterBasics
{
    readonly hp: number;
    readonly power: ICharacterBasicPower;
    readonly armor: number;

    constructor(hp: number, armor: number, power: ICharacterBasicPower)
    {
        this.hp = hp;
        this.power = power;
        this.armor = armor;
    }
}