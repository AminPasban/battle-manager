import { Effect } from "./Effect";

export class PowerEffect extends Effect
{
    apply(): void
    {
        this.target.adjustPower(this.value);
    }
    expire(): void
    {
        this.target.adjustPower(this.value, false);
    }
}