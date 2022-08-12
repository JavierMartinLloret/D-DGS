import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Context } from "../models/context";
import { Activity } from "../models/activity";
import { Reward } from "../models/reward";
import { Diagram } from "../models/diagram";
import { Activity_Property } from "../models/activity_property";
import { Reward_Set } from "../models/reward_set";
import { node } from "../models/node";
import { edge } from "../models/edge";
import { Linker } from "../models/linker";

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

    updateAContext(newContext: Context) {
        return this._httpClient.put(this.contextURL+"/byid/"+newContext._id, newContext);
    }

    deleteAllContextsFromAUser(domain_key: string)
    {
        return this._httpClient.delete(this.contextURL+"/bydomain/"+domain_key);
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

    deleteAllActivitiesFromAContext(contextID: string)
    {
        return this._httpClient.delete(this.activitiesURL+"/context/"+contextID);
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

    postANewProperty_Numerical(property: Activity_Property, value: number) {
        let completeProperty = {
            "activity_ID": property.activity_ID,
            "name": property.name,
            "value_Number": value
        };
        return this._httpClient.post(this.activityPropertyURL, completeProperty);
    }

    postANewProperty_Stringy(property: Activity_Property, value: string) {
        let completeProperty = {
            "activity_ID": property.activity_ID,
            "name": property.name,
            "value_String": value
        };
        return this._httpClient.post(this.activityPropertyURL, completeProperty);
    }

    postANewProperty_Date(property: Activity_Property, value: Date) {
        let completeProperty = {
            "activity_ID": property.activity_ID,
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

    updateRewardSet(rewardSetToUpdate: Reward_Set)
    {
        return this._httpClient.put(this.rewardSetsURL, rewardSetToUpdate);
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

    updateAReward(rewardToUpdate: Reward)
    {
        return this._httpClient.put(this.rewardsURL, rewardToUpdate);
    }

    deleteAReward(rewardID: string) {
        return this._httpClient.delete(this.rewardsURL+"/"+rewardID);
    }

    deleteAllRewardsFromACertainSet(parentSetID: string)
    {
        return this._httpClient.delete(this.rewardsURL+"/fromset/"+parentSetID);
    }

    /* LINKER */

    private linkerURL: string ="http://localhost:3000/linkers";

    getAllLinkers() 
    {
        return this._httpClient.get(this.linkerURL);
    }

    getALinker(id: string)
    {
        return this._httpClient.get(this.linkerURL+"/id/"+id);
    }

    getLinkersFromAnSpecificCategory(category: string)
    {
        return this._httpClient.get(this.linkerURL+"/"+category);
    }

    /* DIAGRAM */

    private diagramURL: string ="http://localhost:3000/diagrams";

    private diagramToBeShowed: Diagram = new Diagram("","",new Array<node>(), new Array<edge>(), undefined);

    getDiagrams(){
        return this._httpClient.get(this.diagramURL);
    }

    getAllDiagramsOfAnUser(domain_key: string){
        return this._httpClient.get(this.diagramURL+"/domain/"+domain_key);
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

    saveDiagramToBeEdited(diagram: Diagram): void
    {
        this.diagramToBeShowed = diagram;
    }

    loadDiagramToBeEdited(): Diagram
    {
        return this.diagramToBeShowed;
    }
}