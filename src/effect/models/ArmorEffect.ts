import { Effect } from "./Effect";
import { EffectType } from "../enums";

export class ArmorEffect extends Effect
{
    type = EffectType.Armor;
    id = this.createEffectID();
    
    orginalValue: number = this.target.armor;
    resultingValue: number = this.target.armor;

    onApply(): void
    {
        this.orginalValue = this.target.armor;
        const armor = this.target.adjustArmor(this.intensity, this.isPositive);
        this.resultingValue = armor;
    }
    onExpire(): void
    {
        this.orginalValue = this.target.armor;
        const armor = this.target.adjustArmor(this.intensity, !this.isPositive);
        this.resultingValue = armor;
    }
}