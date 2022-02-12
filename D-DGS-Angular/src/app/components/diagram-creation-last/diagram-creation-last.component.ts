import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/models/activity';
import { Reward } from 'src/app/models/reward';
import { DiagramDomainService } from 'src/app/services/diagramDomain.service';

  /**
   * SESSIONSTORAGE KEY VALUES
   */
const ActivitiesBuffer: string = "ProvActivities";
const RewardsBuffer: string = "ProvRewards";

@Component({
  selector: 'app-diagram-creation-last',
  templateUrl: './diagram-creation-last.component.html',
  styleUrls: ['./diagram-creation-last.component.css']
})
export class DiagramCreationLastComponent implements OnInit {

  public Activities: any = [];
  public Rewards: any = [];

  public currentLineActivities: Activity[] = new Array<Activity>(); //ProvActivities
  public activitySelected: Activity = new Activity("","");
  public currentLineRewards: Reward[] = new Array<Reward>();
  public rewardSelected: Reward = new Reward("","");
  // public linesRegistered: Lines[];

  // Flags

  constructor(private _diagramDomainService: DiagramDomainService) { }

  ngOnInit(): void {
    this._diagramDomainService.getActivities().subscribe(a => {this.Activities = a;})
    this._diagramDomainService.getRewards().subscribe(r => {this.Rewards = r;})
    // Load activities buffer
    let obj: string | null = sessionStorage.getItem(ActivitiesBuffer);
    if(obj != null)
    {this.currentLineActivities = JSON.parse(obj);}
    // Load reward buffer
    obj = sessionStorage.getItem(RewardsBuffer);
    if(obj != null)
    {this.currentLineRewards = JSON.parse(obj);}
  }

  addAnActivityToTheLine(activity: Activity)
  {
    this.currentLineActivities.push(activity);
    sessionStorage.setItem(ActivitiesBuffer, JSON.stringify(this.currentLineActivities));
  }

  addARewardToTheLine(reward: Reward)
  {
    this.currentLineRewards.push(reward);
    sessionStorage.setItem(RewardsBuffer, JSON.stringify(this.currentLineRewards));
  }

  createALine()
  {

  }

  createTheDiagram()
  {
    
  }

  clearSessionStorage()
  {
    sessionStorage.removeItem(ActivitiesBuffer);
    sessionStorage.removeItem(RewardsBuffer);
    window.location.reload();
  }

}
