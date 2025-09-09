import type { ISimulationSummary } from "../types";
// character
import { Character } from "@/character";
// logger
import { Logger } from "@/logger";

export class BattleManager
{
    player1: Character;
    player2: Character;

    constructor(player1: Character, player2: Character)
    {
        this.player1 = player1;
        this.player2 = player2;
    }

    fight(logger?: Logger)
    {
        logger?.logStart(this.player1, this.player2);

        const players = [this.player1, this.player2];
        const attackerIndex = Math.random() > 0.5 ? 1 : 0;
        let attacker = players[attackerIndex];
        let defender = players[1 - attackerIndex];

        while (true)
        {
            const report = attacker.attack(defender);
            logger?.logAttack(report);

            if (defender.hp <= 0)
            {
                logger?.logWinner(attacker);
                return { winner: attacker };
            }

            [attacker, defender] = [defender, attacker];
        }
    }

    simulateFights(fights: number, logger?: Logger)
    {
        const [c1, c2] = [this.player1, this.player2].map(({ id, name }) =>
        {
            return { id, name, wins: 0, rate: 0 };
        });

        for (let i = 0; i < fights; i++)
        {
            const winner = c1.id === this.fight().winner.id ? c1 : c2;
            winner.wins += 1;
            this.reset();
        }

        c1.rate = +(c1.wins * 100 / fights).toFixed(1);
        c2.rate = +(c2.wins * 100 / fights).toFixed(1);

        const summary: ISimulationSummary = { fights, stats: [c1, c2] };
        logger?.logSimulation(summary);
        return summary;
    }

    reset()
    {
        this.player1.reborn();
        this.player2.reborn();
    }
}
