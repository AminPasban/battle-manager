
export interface IAttackSpecialOptions
{
    crit?: {
        multiplier: number;
        chance: number;
    };
}

export interface IAttackSpecialEffects
{
    critMultiplier?: number;
}

export interface IDamageMetadata
{
    color: string;
}