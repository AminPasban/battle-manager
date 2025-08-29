export interface ISimulateFightsStat
{
    name: string;
    wins: number;
    rate: number;
}

export interface ISimulateFightsResult
{
    fights: number;
    stats: ISimulateFightsStat[];
}