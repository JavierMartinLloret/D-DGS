import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Activity } from 'src/app/models/activity';
import { Activity_Property } from "src/app/models/activity_property";
import { Context } from 'src/app/models/context';
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

  // Containers
  public userContexts: any = [];
  public contextActivities: any = [];
  public ActivitiesProperties: Array<any> = [];

  // Local variables
  public activityIDForTheNewProperty: String = "";
  public newPropertyName: String = "";
  public newPropertyValueType: String = "";
  public newPropertyValue: any = "";

  // Objects
  public contextSelected: Context = new Context("","");
  public newProperty: Activity_Property = new Activity_Property("","");

  // Flags
  public isContextSelected: boolean = false;
  public isAddNewPropertySelected:boolean = false;
  public isNewPropertyValueString: boolean = false;
  public isNewPropertyValueNumeric: boolean = false;
  public isNewPropertyValueDate: boolean = false;

  //

  constructor(private _diagramDomainService: DiagramDomainService, private _router: Router) { 
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(aux)
    {
      this.DOMAIN_KEY = aux;

      this._diagramDomainService.getContextsFromAUser(this.DOMAIN_KEY).subscribe(a => {this.userContexts = a;})
    }
  }

  ngOnInit(): void {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(aux == null || aux == "FAILED")
    {
      sessionStorage.removeItem(LOG_TOKEN);  
      this._router.navigateByUrl('/login');
    }
  }

  contextIsSelected()
  {
    if(this.contextSelected._id != null) // User has picked a context in the menu
    {
      this._diagramDomainService.getActivitiesFromAContext(this.contextSelected._id.toString()).subscribe((activities: any) => {
        this.contextActivities = activities;

        /*  TODA ESTA LÓGICA DEBERÍA ESTAR ENCAPSULADA EN UN MÉTODO DEL SERVICIO */
        activities.forEach((activity:Activity) => {
          if(activity._id != undefined)
          {
            let activityID: String = activity._id;
            this._diagramDomainService.getPropertiesFromAnActivity(activityID.toString()).subscribe((properties: any) => {
              properties.forEach((property: Activity_Property) => {
                this.ActivitiesProperties.push(property);
              });
            })
          }
        });
        /*  TODA ESTA LÓGICA DEBERÍA ESTAR ENCAPSULADA EN UN MÉTODO DEL SERVICIO */

        this.isContextSelected = true;
      })
    }    
  }

  addANewPropertyClicked(activity: Activity)
  {
    this.isAddNewPropertySelected = this.isAddNewPropertySelected ? false: true;
    if(activity._id != undefined)
      this.activityIDForTheNewProperty = activity._id;
  }

  propertyTypeValueSelected()
  {
    this.newPropertyValueType= (document.getElementById("property_value_type_selector") as HTMLTextAreaElement).value;

    // Un saludo a Paco de Discreta
    switch (this.newPropertyValueType) {
      case "String":
        this.isNewPropertyValueString = true;
        this.isNewPropertyValueNumeric = false;
        this.isNewPropertyValueDate = false;
        break;
      case "Number":
        this.isNewPropertyValueString = false;
        this.isNewPropertyValueNumeric = true;
        this.isNewPropertyValueDate = false;
        break;
      case "Date":
        this.isNewPropertyValueString = false;
        this.isNewPropertyValueNumeric = false;
        this.isNewPropertyValueDate = true;
        break;
      default:
        this.isNewPropertyValueString = false;
        this.isNewPropertyValueNumeric = false;
        this.isNewPropertyValueDate = false;
        break;
    }
    
  }

  postNewProperty()
  {
    let property = new Activity_Property(this.activityIDForTheNewProperty, this.newPropertyName);
    let value : any;
    let endProduct: any;

    switch (this.newPropertyValueType) {
      case "String":
        this._diagramDomainService.postANewProperty_Stringy(property, new String(this.newPropertyValue)).subscribe(res => {});
        break;
      case "Number":
        this._diagramDomainService.postANewProperty_Numerical(property, new Number(this.newPropertyValue)).subscribe(res => {});
        break;
      case "Date":
        this._diagramDomainService.postANewProperty_Date(property, new Date(this.newPropertyValue)).subscribe(res => {});
        break;
      default:
        break;
    }

    window.location.reload();
  }  

  debugmethod()
  {
    console.log(this.ActivitiesProperties);
    
  }
}
