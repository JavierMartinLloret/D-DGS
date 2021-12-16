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
  public userInDomainFase: boolean = true;
  public userInRewardFase: boolean = false;
  public userInDesingFase: boolean = false;
  public ActivitiesOnDB: boolean = false;

  constructor(private _diagramDomainService: DiagramDomainService) { }

  ngOnInit(): void {
    this._diagramDomainService.getActivities().subscribe(activities => {
      this.Activities = activities;
    })
    if(this.Activities)
      this.ActivitiesOnDB;
  }

  /* Este uso de la lógica sería ulceroso ante los ojos de Paco, pero más triste es robar. */
  loadSection1()
  {
    this.userInDomainFase = true;
    this.userInRewardFase = false;
    this.userInDesingFase = false;
  }

  loadSection2()
  {
    this.userInDomainFase = false;
    this.userInRewardFase = true;
    this.userInDesingFase = false;
  }

  loadSection3()
  {
    this.userInDomainFase = false;
    this.userInRewardFase = false;
    this.userInDesingFase = true;
  }

}
