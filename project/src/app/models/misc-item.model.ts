import { Player } from "./player.model";
export class MiscItem {

    public constructor(
        public Id: number,
        public name: string,
        public price: number,
        public orderDate: Date
    ) { }
} 