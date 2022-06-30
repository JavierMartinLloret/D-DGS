import { Injectable } from '@angular/core';
import { Linker } from '../models/linker';
import { node } from '../models/node';

@Injectable({
  providedIn: 'root'
})
export class LinkEvaluationService {

  constructor() { }

  evaluateALink(linker: Linker, nodeToLink: node, baseElement: any) : boolean
  {
    let response: boolean = true;
    switch (linker.category) {
      case "ARITHMETIC":
      {
        switch (linker.name) {
          case "Equality":
          case "Distinct":
          {
            // SOLO ASIGNABLE A PROPIEDADES.
            response = (nodeToLink.type=="PROPERTY") ? true : false;
          }break;
          case "Less than":
          case "Less or Equal":
          case "Greater than" :
          case "Greater or equal":
          {
            // SOLO ASIGNABLE A PROPIEDADES. El tipo de la propiedad debe ser != de string.
            response = (nodeToLink.type=="PROPERTY" && (baseElement.value_String == undefined)) ? true : false;
          }break;
          default:break;
        }
      }break;
    
      default:
        break;
    }

    return response;
  }
}
