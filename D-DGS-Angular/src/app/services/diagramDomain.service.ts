import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Activity } from "../models/activity";
import { Task } from "../models/task";
import { Activity_Tasks } from "../models/activity_tasks";
import { Reward } from "../models/reward";
import { Line } from "../models/line";
import { Diagram } from "../models/diagram";

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

    getActivitiesByDomain(domainKey: string)
    {
        return this._httpClient.get(this.activitiesURL+"/domain/"+domainKey);
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

    getTasksByDomain(domainKey: string) {
        return this._httpClient.get(this.tasksURL+"/domain/"+domainKey);
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

    getA_TByDomain(domainKey: string)
    {
        return this._httpClient.get(this.Activity_TasksURL+"/domain/"+domainKey);
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

    updateAnA_TAny(relationship: any)
    {
        return this._httpClient.put(this.Activity_TasksURL+"/"+relationship.activity, relationship);
    }

    deleteAnA_T(parentActivityID: string)
    {
        return this._httpClient.delete(this.Activity_TasksURL+"/"+parentActivityID);
    }

    /* REWARDS */

    private rewardsURL: string ="http://localhost:3000/rewards";

    getRewards() {
        return this._httpClient.get(this.rewardsURL);
    }

    getRewardsByDomain(domainKey: string) {
        return this._httpClient.get(this.rewardsURL+"/domain/"+domainKey);
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

    /* LINE */

    private linesURL: string ="http://localhost:3000/lines";

    getLines(){
        return this._httpClient.get(this.linesURL);
    }

    getLinesByDomain(domainKey: string){
        return this._httpClient.get(this.linesURL+"/domain/"+domainKey)
    }

    getALine(LineID: string){
        return this._httpClient.get(this.linesURL+"/"+LineID);
    }

    postALine(lineToPost: Line){
        return this._httpClient.post(this.linesURL, lineToPost);
    }

    // updateALine

    deleteALine(LineID: string){
        return this._httpClient.delete(this.linesURL);
    }

    /* DIAGRAM */

    private diagramURL: string ="http://localhost:3000/diagrams"

    getDiagrams(){
        return this._httpClient.get(this.diagramURL);
    }

    getDiagrmasByDomain(domainKey: string){
        return this._httpClient.get(this.diagramURL+"/domain/"+domainKey);
    }

    getADiagram(DiagramID: string){
        return this._httpClient.get(this.diagramURL+"/"+DiagramID);
    }

    postADiagram(diagramToPost: Diagram){
        return this._httpClient.post(this.diagramURL, diagramToPost);
    }

    updateADiagram(diagramToUpdate: Diagram){
        return this._httpClient.put(this.diagramURL+"/"+diagramToUpdate._id, diagramToUpdate);
    }

    deleteADiagram(DiagramID: string){
        return this._httpClient.delete(this.diagramURL+"/"+DiagramID);
    }





}