import type { Character } from "../character";
import { Logger } from "../logger";

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
                return { winner: attacker };
            }

            [attacker, defender] = [defender, attacker];
        }
    }

    simulateFights(fights: number, logger?: Logger)
    {
        const [c1, c2] = [this.player1, this.player2].map(({ name }) => ({ name, wins: 0, rate: 0 }));

        for (let i = 0; i < fights; i++)
        {
            const winner = c1.name === this.fight().winner.name ? c1 : c2;
            winner.wins += 1;
            this.reset();
        }

        c1.rate = +(c1.wins * 100 / fights).toFixed(1);
        c2.rate = +(c2.wins * 100 / fights).toFixed(1);

        logger?.logSimulate({ fights, stats: [c1, c2] });
    }

    reset()
    {
        this.player1.reborn();
        this.player2.reborn();
    }
}
