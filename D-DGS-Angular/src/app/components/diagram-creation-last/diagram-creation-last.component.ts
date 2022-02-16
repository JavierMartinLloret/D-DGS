import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/models/activity';
import { Reward } from 'src/app/models/reward';
import { Line } from 'src/app/models/line';
import { Diagram } from "src/app/models/diagram";
import { DiagramDomainService } from 'src/app/services/diagramDomain.service';

  /**
   * SESSIONSTORAGE KEY VALUES
   */
const ActivitiesBuffer: string = "ProvActivities";
const RewardsBuffer: string = "ProvRewards";
const LinesBuffer: string = "ProvLines";

@Component({
  selector: 'app-diagram-creation-last',
  templateUrl: './diagram-creation-last.component.html',
  styleUrls: ['./diagram-creation-last.component.css']
})
export class DiagramCreationLastComponent implements OnInit {

  public Activities: any = [];
  public Rewards: any = [];
  public Lines: Line[] = [];

  public currentLineActivities: Activity[] = new Array<Activity>(); //ProvActivities
  public activitySelected: Activity = new Activity("","");
  public currentLineRewards: Reward[] = new Array<Reward>();
  public rewardSelected: Reward = new Reward("","");
  public newLine: Line = new Line(new Array<String>(), new Array<String>());
  public lineSelected: Line = new Line(new Array<String>(), new Array<String>());
  public currentDiagramLines: Line[] = new Array<Line>();
  public diagramToBeCreated: Diagram = new Diagram(new Array<String>());

  // Flags

  constructor(private _diagramDomainService: DiagramDomainService) { }

  ngOnInit(): void {
    this._diagramDomainService.getActivities().subscribe(a => {this.Activities = a;})
    this._diagramDomainService.getRewards().subscribe(r => {this.Rewards = r;})
    this._diagramDomainService.getLines().subscribe((lines: any) => {this.Lines = lines})
    // Load activities buffer
    let obj: string | null = sessionStorage.getItem(ActivitiesBuffer);
    if(obj != null)
    {this.currentLineActivities = JSON.parse(obj);}
    // Load reward buffer
    obj = sessionStorage.getItem(RewardsBuffer);
    if(obj != null)
    {this.currentLineRewards = JSON.parse(obj);}
    // Load lines from buffer
    obj = sessionStorage.getItem(LinesBuffer);
    if(obj != null)
    {this.currentDiagramLines = JSON.parse(obj);} 
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

  addALineToTheDiagram(lineSelected: Line)
  {
    this.currentDiagramLines.push(lineSelected);
    sessionStorage.setItem(LinesBuffer, JSON.stringify(this.currentDiagramLines));
  }

  createALine()
  {
    // Añadimos a la línea los Ids de las actividades
    this.currentLineActivities.forEach((act: any) => {
      this.newLine.activities.push(act._id);
    })
    // Añadimos a la lína los Ids de las actividades
    this.currentLineRewards.forEach((rew: any) => {
      this.newLine.rewards.push(rew._id);
    })

    this._diagramDomainService.postALine(this.newLine).subscribe(line => {})
    this.clearSessionStorage();
    window.location.reload();
  }

  createTheDiagram()
  {
    this.currentDiagramLines.forEach((line: Line) => {
      if(line._id != null) // Siempre pasa por aquí...
        this.diagramToBeCreated.lines.push(line._id)
    })

    this._diagramDomainService.postADiagram(this.diagramToBeCreated).subscribe(d => {})
    window.location.reload();
  }

  clearSessionStorage()
  {
    sessionStorage.removeItem(ActivitiesBuffer);
    sessionStorage.removeItem(RewardsBuffer);
    sessionStorage.removeItem(LinesBuffer);
    window.location.reload();
  }

}
