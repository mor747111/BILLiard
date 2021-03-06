import { TableMoveStatus } from "./table-move-status.enum"

export class Table {
    public constructor(
        public Id: number,
        public name: string,
        public hourlyRate: number,
        public start: Date,
        public end: Date,
        public isOpen: boolean,
        public moveStatus: TableMoveStatus
    ) { }
}