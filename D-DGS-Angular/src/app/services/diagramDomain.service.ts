import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Activity } from "../models/activity";
import { Task } from "../models/task";

@Injectable({
    providedIn: 'root'
})
export class DiagramDomainService {

    constructor(private _httpClient: HttpClient) {}
    
    /* DOMAIN FASE RELATED METHODS */
    /* ACTIVITIES */
    private activitiesURL: string = "http://localhost:3000/activities";

    getActivities() {
        return this._httpClient.get(this.activitiesURL);
    }

    getAnActivity(activityID: string)
    {
        return this._httpClient.get(this.activitiesURL+"/"+activityID);
    }

    postANewActivity(activityToPost: Activity)
    {
        return this._httpClient.post(this.activitiesURL, activityToPost);
    }

    updateAnActivity(activityToUpdate: Activity) // DEBE MANTENER LA CONSISTENCIA
    {
        return this._httpClient.put(this.activitiesURL, activityToUpdate);
    }

    deleteAnActivity(activityID: string) // DEBE MANTENER LA CONSISTENCIA
    {
        return this._httpClient.delete(this.activitiesURL+"/"+activityID);
    }

    /* TASKS */
    private tasksURL: string = "http://localhost:3000/tasks";

    getTasks() {
        return this._httpClient.get(this.tasksURL);
    }

    getATask(taskID: string)
    {
        return this._httpClient.get(this.tasksURL+"/"+taskID);
    } 

    postANewTask(taskToPost: Task) {
        return this._httpClient.post(this.tasksURL, taskToPost);
    }

    deleteATask(taskID: string)
    {
        return this._httpClient.delete(this.tasksURL+"/"+taskID);
    }
}