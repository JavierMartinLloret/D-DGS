import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Activity } from 'src/app/models/activity';
import { Reward } from 'src/app/models/reward';
import { Task } from 'src/app/models/task';
import { Activity_Tasks} from 'src/app/models/activity_tasks'
import { DiagramDomainService } from "src/app/services/diagramDomain.service";

const LOG_TOKEN: string = "LOG_TOKEN";
// LOG_TOKEN: null | FAILED | identificador del dominio del usuario

@Component({
  selector: 'app-diagram-creation',
  templateUrl: './diagram-creation.component.html',
  styleUrls: ['./diagram-creation.component.css']
})
export class DiagramCreationComponent implements OnInit {
  
  // Domain_Key
  public DOMAIN_KEY: string="";

  // Variables fase 1
  public Activities: any = [];
  public Tasks: any = [];
  public Activities_Tasks: any = [];
  public newTasksArray: Task[] = new Array<Task>();
  public activityToCreate: Activity = new Activity("","","");
  public taskToCreate: Task = new Task("","","");
  public relationshipWhichWillBeUpdated: Activity_Tasks = new Activity_Tasks("",new Array<string>());
  
  // Variables fase 2
  public Rewards: any = [];
  public rewardToCreate: Reward = new Reward("","","");

  // Flags multifase
  public userInDomainFase: boolean = true;
  public userInRewardFase: boolean = false;

  // Flags fase 1
  public addNewActivityIsClicked: boolean = false;
  public addNewTaskIsClicked: boolean = false;

  // Flags fase 2
  public thereAreRewards: boolean = false;
  public addNewRewardIsClicked: boolean = false;
  

  constructor(private _diagramDomainService: DiagramDomainService, private _router: Router) {
    if(sessionStorage.getItem("userInDomainFase") == null)
    {
      sessionStorage.setItem("userInDomainFase", "true");
      sessionStorage.setItem("userInRewardFase", "false");
    }
    else
    {
      this.userInDomainFase = (sessionStorage.getItem("userInDomainFase") == "true") ? true: false;
      this.userInRewardFase = (sessionStorage.getItem("userInRewardFase") == "true") ? true: false; 
    }

    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(aux) // USER IS CORRECTLY LOGGED, OTHERWISE 
    {
      this.DOMAIN_KEY = aux;

      this._diagramDomainService.getActivitiesByDomain(this.DOMAIN_KEY).subscribe(activities => {
        this.Activities = activities;
      })
      this._diagramDomainService.getA_TByDomain(this.DOMAIN_KEY).subscribe(relationships => {
        this.Activities_Tasks = relationships;
      }) 
      this._diagramDomainService.getTasksByDomain(this.DOMAIN_KEY).subscribe(tasks => {
        this.Tasks = tasks;
      })
      this._diagramDomainService.getRewardsByDomain(this.DOMAIN_KEY).subscribe(rewards => {
        this.Rewards = rewards;
      })
    }
    if(this.Rewards)
      this.thereAreRewards = true;
  }

  ngOnInit(): void {
    if(sessionStorage.getItem(LOG_TOKEN) == null || sessionStorage.getItem(LOG_TOKEN) == "FAILED")
    {
      sessionStorage.removeItem(LOG_TOKEN);  
      this._router.navigateByUrl('/login');
    }
  }

  loadSection1()
  {
    this.userInDomainFase = true;
    this.userInRewardFase = false;
    sessionStorage.setItem("userInDomainFase", "true");
    sessionStorage.setItem("userInRewardFase", "false");
  }

  loadSection2()
  {
    this.userInDomainFase = false;
    this.userInRewardFase = true;
    sessionStorage.setItem("userInDomainFase", "false");
    sessionStorage.setItem("userInRewardFase", "true");
  }

  addNewActivityClicked()
  {
    this.addNewActivityIsClicked = (this.addNewActivityIsClicked) ? false: true;
  }

  addNewTaskClicked(relationshipToUpdate: Activity_Tasks)
  {
    this.relationshipWhichWillBeUpdated = relationshipToUpdate;
    this.addNewTaskIsClicked = (this.addNewTaskIsClicked) ? false: true;
  }

  addNewRewardClicked()
  {
    this.addNewRewardIsClicked = (this.addNewRewardIsClicked) ? false: true;
  }

  getLocalActivity(id: string) // Because who cares about efficiency?
  {
    let seekedActivity: Activity = new Activity("","","");
    this.Activities.forEach((activity: any) => {
      if(activity._id == id)
        seekedActivity = activity;
    });

    return seekedActivity;
  }

  getLocalTask(id: string)
  {
    let seekedTask: Task = new Task("","","");
    this.Tasks.forEach((task: any) => {
      if(task._id == id)
        seekedTask = task;
    });

    return seekedTask;
  }

  /* ACTIVITY */

  addNewActivity()
  {
    this.activityToCreate.domain_key = this.DOMAIN_KEY;
    this._diagramDomainService.postANewActivity(this.activityToCreate).subscribe((newActivityID: any) => {
      window.location.reload();
    })
  }

  // Edit activity (?)

  removeActivity(activityID: string)
  {
    this._diagramDomainService.getAnA_T(activityID).subscribe(rel => {
    let relationReference: any = rel;
    let tasks: Array<string> = relationReference.tasks;
    tasks.forEach(ID => {       //Si no hay tareas asociadas no entra aquí    
      this._diagramDomainService.deleteATask(ID).subscribe(res => {})
    });
    // Borrar la propia relación
    this._diagramDomainService.deleteAnA_T(relationReference._id).subscribe(val => {})
    // Borrar la actividad
    this._diagramDomainService.deleteAnActivity(activityID).subscribe(val => {})
      
    window.location.reload();
    })
  }

  /* TASK */

  addNewTask()
  {
    this.taskToCreate.domain_key = this.DOMAIN_KEY;
    this._diagramDomainService.postANewTask(this.taskToCreate).subscribe((newTask: any) => {
      let auxArray: Array<String> = this.relationshipWhichWillBeUpdated.tasks;
      auxArray.push(newTask._id);
      this.relationshipWhichWillBeUpdated.tasks = auxArray;
      this._diagramDomainService.updateAnA_T(this.relationshipWhichWillBeUpdated).subscribe(rel => {window.location.reload();})
    })
  }

  removeTask(parentActivityID: string, taskID: string)
  {
    /*Eliminar del array de tareas de la A_Ts el ID de la tarea a eliminar
        Actualizar la relación en BDD
      Eliminar la propia tarea de la BDD 
    */
    this._diagramDomainService.getAnA_T(parentActivityID).subscribe((relation: any) => {
      let tasksAttached: Array<String> = relation.tasks;
      let newTaskArray: Array<String> = new Array<String>();
      tasksAttached.forEach((task: String) => {
        if(task != taskID)
          newTaskArray.push(task);
      })
      relation.tasks = newTaskArray;

      this._diagramDomainService.updateAnA_TAny(relation).subscribe((result:any) => {
        window.location.reload();
      })
    })
    this._diagramDomainService.deleteATask(taskID).subscribe((result:any) => {
    })
    
  }

  /* REWARD */

  addNewReward()
  {
    this.rewardToCreate.domain_key = this.DOMAIN_KEY;
    this._diagramDomainService.postANewReward(this.rewardToCreate).subscribe(reward => {})
    window.location.reload();
  }

  deleteReward(rewardToDelete: any)
  {    
    this._diagramDomainService.deleteAReward(rewardToDelete._id).subscribe(reward => {})
    window.location.reload();
  }

}
