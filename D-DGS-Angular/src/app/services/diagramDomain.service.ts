import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Context } from "../models/context";
import { Activity } from "../models/activity";
import { Task } from "../models/task";
import { Activity_Tasks } from "../models/activity_tasks";
import { Reward } from "../models/reward";
import { Line } from "../models/line";
import { Diagram } from "../models/diagram";
import { Activity_Property } from "../models/activity_property";
import { Reward_Set } from "../models/reward_set";

@Injectable({
    providedIn: 'root'
})
export class DiagramDomainService {

    constructor(private _httpClient: HttpClient) {}
    
    /* CONTEXT */
    private contextURL: string = "http://localhost:3000/context";

    getAllContexts() {
        return this._httpClient.get(this.contextURL);
    }

    getContextsFromAUser(domain_key: string) {
        return this._httpClient.get(this.contextURL+"/bydomain/"+domain_key);        
    }

    getContextFromId(id: string) {
        return this._httpClient.get(this.contextURL+"/byid/"+id);
    }

    postANewContext(newContext: Context) {
        return this._httpClient.post(this.contextURL, newContext);
    }

    deleteAContext(id: string) {
        return this._httpClient.delete(this.contextURL+"/byid/"+id);
    }

    /* ACTIVITIES */
    private activitiesURL: string = "http://localhost:3000/activities";

    getAllActivities() {
        return this._httpClient.get(this.activitiesURL);
    }

    getActivitiesFromAContext(contextID: string)
    {
        return this._httpClient.get(this.activitiesURL+"/context/"+contextID);
    }

    getActivityFromId(activityID: string)
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

    /* ACTIVITY_PROPERTIES */
    private activityPropertyURL = "http://localhost:3000/activity_property";

    getAllProperties() {
        return this._httpClient.get(this.activityPropertyURL);
    }

    getPropertiesFromAnActivity(activityID: string) {
        return this._httpClient.get(this.activityPropertyURL+"/fromactivity/"+activityID);
    }

    getPropertyFromID(propertyID: string) {
        return this._httpClient.get(this.activityPropertyURL+"/"+propertyID);
    }

    postANewProperty_Numerical(property: Activity_Property, value: Number) {
        let completeProperty = {
            "activity_ID": property.activityID,
            "name": property.name,
            "value_Number": value
        };
        return this._httpClient.post(this.activityPropertyURL, completeProperty);
    }

    postANewProperty_Stringy(property: Activity_Property, value: String) {
        let completeProperty = {
            "activity_ID": property.activityID,
            "name": property.name,
            "value_String": value
        };
        return this._httpClient.post(this.activityPropertyURL, completeProperty);
    }

    postANewProperty_Date(property: Activity_Property, value: Date) {
        let completeProperty = {
            "activity_ID": property.activityID,
            "name": property.name,
            "value_Date": value
        };
        return this._httpClient.post(this.activityPropertyURL, completeProperty);
    }


    deleteAProperty(propertyID: string) {
        return this._httpClient.delete(this.activityPropertyURL+"/"+propertyID)
    }

    deleteAllPropertiesFromAnActivity(activityID: string) {
        return this._httpClient.delete(this.activityPropertyURL+"/fromactivity/"+activityID);
    }

    /* REWARD_SET */

    private rewardSetsURL: string ="http://localhost:3000/reward_set";

    getAllRewardSets() {
        return this._httpClient.get(this.rewardSetsURL);
    }

    getAllRewardSetsFromACertainUser(userDomain: string)
    {
        return this._httpClient.get(this.rewardSetsURL+"/fromdomain/"+userDomain);
    }

    getARewardSet(rewardSetID: string)
    {
        return this._httpClient.get(this.rewardSetsURL+"/"+rewardSetID);
    }

    postANewRewardSet(newRewardSet: Reward_Set)
    {
        return this._httpClient.post(this.rewardSetsURL, newRewardSet);
    }

    deleteARewardSet(rewardSetID: string)
    {
        return this._httpClient.delete(this.rewardSetsURL+"/"+rewardSetID);
    }

    deleteAllRewardSetsFromASpecificUser(userDomain: string)
    {
        return this._httpClient.delete(this.rewardSetsURL+"/fromdomain/"+userDomain);
    }

    /* REWARDS */

    private rewardsURL: string ="http://localhost:3000/rewards";

    getRewards() {
        return this._httpClient.get(this.rewardsURL);
    }

    getRewardsOfACertainSet(parentSetID: string) {
        return this._httpClient.get(this.rewardsURL+"/fromset/"+parentSetID);
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

    deleteAllRewardsFromACertainSet(parentSetID: string)
    {
        return this._httpClient.delete(this.rewardsURL+"/fromset/"+parentSetID);
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