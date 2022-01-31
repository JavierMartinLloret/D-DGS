import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Activity } from 'src/app/models/activity';
import { Reward } from 'src/app/models/reward';
import { Task } from 'src/app/models/task';
import { Activity_Tasks} from 'src/app/models/activity_tasks'
import { DiagramDomainService } from "src/app/services/diagramDomain.service";

import { Observable, of } from "rxjs";

@Component({
  selector: 'app-diagram-creation',
  templateUrl: './diagram-creation.component.html',
  styleUrls: ['./diagram-creation.component.css']
})
export class DiagramCreationComponent implements OnInit {
  
  // Variables fase 1
  public Activities: any = [];
  public Tasks: any = [];
  public Activities_Tasks: any = [];
  public newTasksArray: Task[] = new Array<Task>();
  public activityToCreate: Activity = new Activity("","");
  public parentActivityForTheNewTask: Activity = new Activity("","");
  public taskToCreate: Task = new Task("","");
  
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
    this._diagramDomainService.getAllA_T().subscribe(relationships => {
      this.Activities_Tasks = relationships;
    })    

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

  /* ACTIVITY */

  addNewActivity()
  {
    this._diagramDomainService.postANewActivity(this.activityToCreate).subscribe(activity => {
      if(activity)
        this._router.navigateByUrl('/create_a_diagram');
    });

    window.location.reload();
  }

  removeActivity(activityToRemove: any)
  {
    let actReference: any = activityToRemove;

    this._diagramDomainService.getAnA_T(actReference._id).subscribe(rel => {
      if(rel != null) // Existen tareas asociadas a la actividad
      {
        let relationReference: any = rel;
        let tasks: Array<string> = relationReference.tasks;
        tasks.forEach(ID => {          
          this._diagramDomainService.deleteATask(ID).subscribe(res => {})
        });
        // Borrar la propia relación
        this._diagramDomainService.deleteAnA_T(relationReference._id).subscribe(val => {})
      }
      // Borrar la actividad
      this._diagramDomainService.deleteAnActivity(actReference._id).subscribe(val => {})     
    })
    
    window.location.reload();
  }

  addNewTask(parentActivity: any)
  {
    /*
        Crear la petición para la tarea y "rescatar" el ObjectID generado.

        Obtener el Objeto Relaciones de la actividad.

        Si existe el objeto de relaciones, modifico el array de tareas (añadir el nuevo ObjectID).

        Si no existe, creo el objeto tanto con el ID de la actividad como con el ID de la tarea.
    */
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
