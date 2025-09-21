import { Effect } from "./Effect";
import { EffectType } from "../enums";

export class PowerEffect extends Effect
{
    type = EffectType.Power;
    id = this.createEffectId("pwr");
    
    baseValue: number = this.target.powerAVG;
    currentValue: number = this.target.powerAVG;

    onApply(): void
    {
        this.baseValue = this.target.powerAVG;
        this.target.modifyPower(this.magnitude, this.isBuff);
        this.currentValue = this.target.powerAVG;
    }
    onExpire(): void
    {
        this.baseValue = this.target.powerAVG;
        this.target.modifyPower(this.magnitude, !this.isBuff);
        this.currentValue = this.target.powerAVG;
    }
}