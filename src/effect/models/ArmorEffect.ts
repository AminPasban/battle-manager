import { Effect } from "./Effect";

export class ArmorEffect extends Effect {
    onApply(): void
    {
        this.target.adjustArmor(this.value, this.isPositive);
    }
    onExpire(): void
    {
        this.target.adjustArmor(this.value, !this.isPositive);
    }
}