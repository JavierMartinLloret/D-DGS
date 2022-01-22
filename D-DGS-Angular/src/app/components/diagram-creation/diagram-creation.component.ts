import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Activity } from 'src/app/models/activity';
import { Reward } from 'src/app/models/reward';
import { Task } from 'src/app/models/task';
import { DiagramDomainService } from "src/app/services/diagramDomain.service";

@Component({
  selector: 'app-diagram-creation',
  templateUrl: './diagram-creation.component.html',
  styleUrls: ['./diagram-creation.component.css']
})
export class DiagramCreationComponent implements OnInit {
  
  // Variables fase 1
  public Activities: any = [];
  public Tasks: any = [];
  public newTasksArray: Task[] = new Array<Task>();
  public activityToCreate: Activity = new Activity("","",this.newTasksArray);
  public parentActivityForTheNewTask: Activity = new Activity("","",this.newTasksArray);
  public taskToCreate: Task = new Task("","", this.parentActivityForTheNewTask);
  
  // Variables fase 2
  public Rewards: any = [];
  public rewardToCreate: Reward = new Reward("","");

  // Flags fase 1
  public ActivitiesOnDB: boolean = false;
  public userInDomainFase: boolean = true;
  public userInRewardFase: boolean = false;
  public userInDesingFase: boolean = false;
  public addNewActivityIsClicked: boolean = false;
  public addNewTaskIsClicked: boolean = false;

  // Flags fase 2
  public thereAreRewards: boolean = false;
  public addNewRewardIsClicked: boolean = false;
  

  constructor(private _diagramDomainService: DiagramDomainService,
              private _router: Router) { }

  ngOnInit(): void {
    this._diagramDomainService.getActivities().subscribe(activities => {
      this.Activities = activities;
    })
    this._diagramDomainService.getTasks().subscribe(tasks => {
      this.Tasks = tasks;
    })
    if(this.Activities)
      this.ActivitiesOnDB;

    this._diagramDomainService.getRewards().subscribe(rewards => {
      this.Rewards = rewards;
    })
    if(this.Rewards)
      this.thereAreRewards = true;
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

  addNewRewardClicked()
  {
    this.addNewRewardIsClicked = (this.addNewRewardIsClicked) ? false: true;
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
    window.location.reload();
  }

  addNewTask()
  {
    console.log("addNewTask 1");    
    // AÑADIR LA NUEVA TAREA A BD
    this.taskToCreate.activity = this.parentActivityForTheNewTask;
    this._diagramDomainService.postANewTask(this.taskToCreate).subscribe(task => {
      if(task)
        this._router.navigateByUrl('/create_a_diagram');
    });

    console.log("addNewTask 2");
    // ACTUALIZAR LA ACTIVIDAD
    // NECESITO EL _ID DE LA ACTIVIDAD QUE CORRESPONDE A ACTIVITY TO CREATE
    this.activityToCreate.tasks.push(this.taskToCreate);
    this._diagramDomainService.updateAnActivity(this.activityToCreate).subscribe(activity => {
      if(activity)
        this._router.navigateByUrl('/create_a_diagram');
    })

    console.log("addNewTask 3");
    //window.location.reload();
    
    console.log("addNewTask 4");
  }

  addNewReward()
  {
    this._diagramDomainService.postANewReward(this.rewardToCreate).subscribe(reward => {
      if(reward)
        this._router.navigateByUrl('/create_a_diagram');
    })
    window.location.reload();
  }

  deleteReward(rewardToDelete: any)
  {    
    this._diagramDomainService.deleteAReward(rewardToDelete._id).subscribe(reward => {
      if(reward)
        this._router.navigateByUrl('/create_a_diagram');
    })
    window.location.reload();
  }

}
