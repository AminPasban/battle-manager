export interface ISimulationFighterStats
{
    id: string;
    name: string;
    wins: number;
    rate: number;
}

export interface ISimulationSummary
{
    fights: number;
    stats: ISimulationFighterStats[];
}