import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Activity } from 'src/app/models/activity';
import { Task } from 'src/app/models/task';
import { DiagramDomainService } from "src/app/services/diagramDomain.service";

@Component({
  selector: 'app-diagram-creation',
  templateUrl: './diagram-creation.component.html',
  styleUrls: ['./diagram-creation.component.css']
})
export class DiagramCreationComponent implements OnInit {
  
  public Activities: any = [];
  public newTasksArray: Task[] = new Array<Task>();
  public activityToCreate: Activity = new Activity("","",this.newTasksArray);
  public parentActivityForTheNewTask: Activity = new Activity("","",this.newTasksArray);
  public taskToCreate: Task = new Task("","", this.parentActivityForTheNewTask);

  // Flags
  public ActivitiesOnDB: boolean = false;
  public userInDomainFase: boolean = true;
  public userInRewardFase: boolean = false;
  public userInDesingFase: boolean = false;
  public addNewActivityIsClicked: boolean = false;
  public addNewTaskIsClicked: boolean = false;

  

  constructor(private _diagramDomainService: DiagramDomainService,
              private _router: Router) { }

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

  addNewActivityClicked()
  {
    this.addNewActivityIsClicked = (this.addNewActivityIsClicked) ? false: true;
  }

  addNewTaskClicked(parentActivity: Activity)
  {
    this.parentActivityForTheNewTask = parentActivity;
    this.addNewTaskIsClicked = (this.addNewTaskIsClicked) ? false: true;
  }

  activtyHasTaskAttached(activityToEvaluate: Activity) // To display or not some text on the page view
  {
    return activityToEvaluate.tasks.length != 0;
  }

  addNewActivity()
  {
    this._diagramDomainService.postANewActivity(this.activityToCreate).subscribe(activity => {
      if(activity)
        this._router.navigateByUrl('/create_a_diagram');
    });
  }

  addNewTaskToAnActivity()
  {
    this.taskToCreate.activity = this.parentActivityForTheNewTask; //Updating parent activity
    this._diagramDomainService.postANewTask(this.taskToCreate);
    
    this.parentActivityForTheNewTask.tasks.push(this.taskToCreate);
    this._diagramDomainService.updateAnActivity(this.parentActivityForTheNewTask);

  }

}
