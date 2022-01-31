import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Activity } from "../models/activity";
import { Task } from "../models/task";
import { Activity_Tasks } from "../models/activity_tasks";
import { Reward } from "../models/reward";

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

    updateAnActivity(activityToUpdate: Activity)
    {
        return this._httpClient.put(this.activitiesURL, activityToUpdate);
    }

    deleteAnActivity(activityID: string)
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

    /* ACTIVITY - REWARDS */
    private Activity_TasksURL: string = "http://localhost:3000/activities_tasks"

    getAllA_T()
    {
        return this._httpClient.get(this.Activity_TasksURL);
    }

    getAnA_T(parentActivityID: string)
    {
        return this._httpClient.get(this.Activity_TasksURL+"/"+parentActivityID);
    }

    postANewA_T(relationship: Activity_Tasks)
    {
        return this._httpClient.post(this.Activity_TasksURL, relationship);
    }

    updateAnA_T(relationship: Activity_Tasks)
    {
        return this._httpClient.put(this.Activity_TasksURL+"/"+relationship.activity, relationship);
    }

    deleteAnA_T(parentActivityID: string)
    {
        return this._httpClient.delete(this.Activity_TasksURL+"/"+parentActivityID);
    }

    /* REWARDS */

    private rewardsURL: string ="http://localhost:3000/rewards"

    getRewards() {
        return this._httpClient.get(this.rewardsURL);
    }

    getAReward(rewardID: string) {
        return this._httpClient.get(this.rewardsURL+"/"+rewardID);
    }

    postANewReward(rewardToPost: Reward)
    {
        return this._httpClient.post(this.rewardsURL, rewardToPost);
    }

    deleteAReward(rewardID: string) {
        return this._httpClient.delete(this.rewardsURL+"/"+rewardID);
    }
}