import { Effect } from "./Effect";
import { EffectType } from "../enums";

export class PowerEffect extends Effect
{
    type = EffectType.Power;
    id = this.createEffectID();
    
    orginalValue: number = this.target.powerAVG;
    resultingValue: number = this.target.powerAVG;

    onApply(): void
    {
        this.orginalValue = this.target.powerAVG;
        this.target.adjustPower(this.intensity, this.isPositive);
        this.resultingValue = this.target.powerAVG;
    }
    onExpire(): void
    {
        this.orginalValue = this.target.powerAVG;
        this.target.adjustPower(this.intensity, !this.isPositive);
        this.resultingValue = this.target.powerAVG;
    }
}