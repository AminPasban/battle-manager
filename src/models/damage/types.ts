export interface ICrit
{
    multiplier: number;
    chance: number;
}

export interface ITalisman
{
    power: number;
    chance: number;
}

export interface IMultiAttack
{
    chance: number;
}

export interface IAttackSpecialOptions
{
    crit?: ICrit;
    talisman?: ITalisman;
}

export interface IAttackSpecialEffects
{
    critMultiplier?: number;
}

export interface IDamageMetadata
{
    color: string;
}