import { Effect } from "./Effect";
import { EffectType } from "../enums";

export class ArmorEffect extends Effect
{
    type = EffectType.Armor;
    id = this.createEffectId("arm");

    baseValue: number = this.target.armor;
    currentValue: number = this.target.armor;

    onApply(): void
    {
        this.baseValue = this.target.armor;
        const armor = this.target.modifyArmor(this.magnitude, this.isBuff);
        this.currentValue = armor;
    }
    onExpire(): void
    {
        this.baseValue = this.target.armor;
        const armor = this.target.modifyArmor(this.appliedValue, !this.isBuff);
        this.currentValue = armor;
    }
}