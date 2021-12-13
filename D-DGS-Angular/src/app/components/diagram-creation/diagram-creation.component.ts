import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/models/activity';
import { DiagramDomainService } from "src/app/services/diagramDomain.service";

@Component({
  selector: 'app-diagram-creation',
  templateUrl: './diagram-creation.component.html',
  styleUrls: ['./diagram-creation.component.css']
})
export class DiagramCreationComponent implements OnInit {
  
  public Activities: any = [];
  private ActivitiesOnDB: boolean = false;

  constructor(private _diagramDomainService: DiagramDomainService) { }

  ngOnInit(): void {
    this._diagramDomainService.getActivities().subscribe(activities => {
      this.Activities = activities;
    })
    if(this.Activities)
      this.ActivitiesOnDB;
  }

}
