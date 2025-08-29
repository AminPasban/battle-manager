import { BattleManager } from "./battle-manager/BattleManager";
import { CharacterFactory } from "./character";
import { CharacterType } from "./character/enums";
import { Logger } from "./logger";

const c1 = CharacterFactory.new(CharacterType.Warrior, "Bahram");
const c2 = CharacterFactory.new(CharacterType.Mage, "Merlin");
const c3 = CharacterFactory.new(CharacterType.Archer, "Arash");

const battleManager = new BattleManager(c1, c2);
const logger = new Logger();

battleManager.fight(logger);
// battleManager.simulateFights(1000, logger);

// logger.logAttack(c2.attack(c1));
// logger.logAttack(c3.attack(c1));

document.getElementById("button")?.addEventListener("click", () =>
{
    logger.clear();
    battleManager.reset();
    battleManager.fight(logger);
});