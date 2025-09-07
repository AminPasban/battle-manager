import { BattleManager } from "./battle-manager";
import { CharacterFactory } from "./character";
import { CharacterType } from "./character/enums";
import { Logger } from "./logger";

const c1 = CharacterFactory.new(CharacterType.Warrior, "Bahram");
const c2 = CharacterFactory.new(CharacterType.Mage, "Merlin");
const c3 = CharacterFactory.new(CharacterType.Archer, "Arash");

const battleManager = new BattleManager(c1, c3);
const logger = new Logger();

battleManager.fight(logger);

document.getElementById("Fight")?.addEventListener("click", () =>
{
    logger.clear();
    battleManager.reset();
    battleManager.fight(logger);
});

document.getElementById("Simulate")?.addEventListener("click", () =>
{
    logger.clear();
    battleManager.reset();
    battleManager.simulateFights(1000, logger);
});