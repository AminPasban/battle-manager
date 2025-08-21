import type { Character } from "./character";
import { Logger } from "./logger";

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
            const result = attacker.attack(defender);
            logger?.logAttack(result);

            if (defender.hp <= 0)
            {
                logger?.logWinner(attacker);
                return attacker;
            }

            [attacker, defender] = [defender, attacker];
        }
    }

    simulateFights(fights: number)
    {
        const winStats = {
            [this.player1.name]: { count: 0, rate: 0 },
            [this.player2.name]: { count: 0, rate: 0 }
        }

        for (let i = 0; i < fights; i++)
        {
            const winner = this.fight();
            winStats[winner.name].count += 1;
            this.reset();
        }

        winStats[this.player1.name].rate = +(winStats[this.player1.name].count * 100 / fights).toFixed(1);
        winStats[this.player2.name].rate = +(winStats[this.player2.name].count * 100 / fights).toFixed(1);

        return { ...winStats, fights };
    }

    reset()
    {
        this.player1.reborn();
        this.player2.reborn();
    }
}
