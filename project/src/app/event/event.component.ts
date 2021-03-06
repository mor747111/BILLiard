import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LocalDataStorerService } from "../services/storage/local-data-storer.service";
import { MiscItem } from "../models/misc-item.model";
import { Player } from "../models/player.model";
import { GameEvent } from "../models/game-event.model";
import { Table } from "../models/table.model";
import { TableMoveStatus } from "../models/table-move-status.enum";
import { TableMovement } from "../models/table-movement.model";
import { TableRecord } from "../models/table-record.model";
import { config } from '../config';
import { GameCalculationsService } from "../services/game/game-calculations.service";
import { TableActivity } from "../models/table-activity.model";
import { IDGeneratorService } from "../services/storage/id-generator.service";
import { GameActionsService } from "../services/game/game-actions.service";
import { GenericLocalDataStorerService } from "../services/storage/generic-local-data-storer.service";

@Component({
  selector: 'event',
  templateUrl: './event.template.html',
  styleUrls: ['./event.stylesheet.css']
})
export class EventComponent implements OnInit {

  private eventId: number; // The event's Id
  private event: GameEvent;

  private isEditingName: boolean;
  private enteredEventName: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataStorer: GenericLocalDataStorerService,
    private IDGenerator: IDGeneratorService,
    private gameCalculator: GameCalculationsService,
    private gameActions: GameActionsService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = +params['eventId'];
    })
    this.dataStorer.getGameEvent(this.eventId).then(resolvedEvent => this.event = resolvedEvent).catch(reason => {
      this.router.navigate(['/error'])
    });
  }

  private onChangeName() {
    console.debug(`Changing event name from: ${this.event.name} to: ${this.enteredEventName}`);
    this.event.name = this.enteredEventName;
    this.dataStorer.storeGameEvent(this.event);
    this.isEditingName = false;
  }

  private onPlayerFormSubmitted(newPlayer: Player) {
    if (newPlayer != undefined) {
      console.debug(`a new player was submitted with id: ${newPlayer.Id}`)
      this.event.players.push(newPlayer);
      console.debug(`Storing the game event (id: ${this.event.Id}) with the new player`);
      this.dataStorer.storeGameEvent(this.event);
    }
  }

  private onTableFormSubmitted(newTable: Table) {
    if (newTable != undefined) {
      console.debug(`a new table was submitted with id: ${newTable.Id}`)
      this.event.tables.push(newTable);
      this.event.tableActivities.push(new TableActivity(this.IDGenerator.generateId(), newTable, new Date(), null));
      console.debug(`Storing the game event (id: ${this.event.Id}) with the new table`);
      this.dataStorer.storeGameEvent(this.event);
    }
  }

  private onConfirmation() {
    if (this.event.end) {
      this.gameActions.openEvent(this.event);
    } else {
      this.gameActions.closeEvent(this.event);
    }
  }

  private onDeleteEvent() {
    this.gameActions.deleteEvent(this.event);
    this.router.navigate(['/']);
  }

} 
