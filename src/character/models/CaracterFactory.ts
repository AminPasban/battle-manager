import { Warrior } from "./Warrior";
import { Mage } from "./Mage";
import { Archer } from "./Archer";
import { CharacterType } from "../enums";

export class CharacterFactory
{
    static new(type: CharacterType, name: string)
    {
        switch (type)
        {
            case CharacterType.Warrior:
                return new Warrior(name);
            case CharacterType.Mage:
                return new Mage(name);
            case CharacterType.Archer:
                return new Archer(name);
            default:
                throw new Error("Invalid character type");
        }
    }
}
