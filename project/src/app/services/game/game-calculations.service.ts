import { Injectable } from '@angular/core';
import { config } from '../../config';
import { Table } from "../../models/table.model";
import { TableRecord } from "../../models/table-record.model";
import { Player } from "../../models/player.model";
import { GameEvent } from "../../models/game-event.model";

@Injectable()
export class GameCalculationsService {

    // Returns the number of players that are currently playing on the table
    public calculatePlayersOnTable(table: Table, event: GameEvent): number {
        return event.tableRecords.filter((tableRecord: TableRecord) => tableRecord.table.Id === table.Id && tableRecord.end == undefined).length;
    }

    // Determines whether the player is playing in any table right now.
    public isPlayerPlaying(player: Player, event: GameEvent): boolean {
        let playingTables: number = event.tableRecords.filter(record => record.player.Id === player.Id && record.end == undefined).length;
        return playingTables > 0;
    }

    // Returns an array of the tables that the player is currently playing on
    public getPlayingTables(player: Player, event: GameEvent): Table[] {
        let playingTablesRecords: TableRecord[] = event.tableRecords.filter(record => record.player.Id === player.Id && record.end == undefined);
        return playingTablesRecords.map<Table>(record => record.table);
    }

    // Returns an array of tables that are:
    // * Active
    // * The player is not currently playing on them.
    public getAvailableTablesForPlayer(player: Player, event: GameEvent): Table[] {
        return event.tables.filter(table => {
            let relatedPlayerTableRecords = event.tableRecords.findIndex(record =>
                record.table.Id === table.Id &&
                record.end == undefined &&
                record.player.Id === player.Id
            );
            return relatedPlayerTableRecords === -1 && table.isOpen;
        });
    }

}