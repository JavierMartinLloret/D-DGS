import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/models/activity';
import { DiagramDomainService } from "src/app/services/diagramDomain.service";

@Component({
  selector: 'app-diagram-creation',
  templateUrl: './diagram-creation.component.html',
  styleUrls: ['./diagram-creation.component.css']
})
export class DiagramCreationComponent implements OnInit {
  /* This class will change alot when different domains were implemented for now,
    lets assume there's just one domain to make it all easier. */

  public Activities: any = [];
  public Tasks: any = [];
  public ActivitiesOnDB: boolean = false;

  constructor(private _diagramDomainService: DiagramDomainService) { }

  ngOnInit(): void {
    this._diagramDomainService.getActivities().subscribe(activities => {
      this.Activities = activities;
    })
    this._diagramDomainService.getTasks().subscribe(tasks => {
      this.Tasks = tasks;
    })
    if(this.Activities)
      this.ActivitiesOnDB = true;
  }

}
