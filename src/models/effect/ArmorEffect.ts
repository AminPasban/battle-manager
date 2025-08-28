import { Effect } from "./Effect";

export class ArmorEffect extends Effect {
    apply(): void
    {
        this.target.adjustArmor(this.value, this.isPositive);
    }
    expire(): void
    {
        this.target.adjustArmor(this.value, !this.isPositive);
    }
}