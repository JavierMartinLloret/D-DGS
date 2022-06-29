import { Injectable } from '@angular/core';
import { Linker } from '../models/linker';
import { node } from '../models/node';

@Injectable({
  providedIn: 'root'
})
export class LinkEvaluationService {

  constructor() { }

  evaluateALink(linker: Linker, nodeToLink: node) : boolean
  {
    let response: boolean = true;
    switch (linker.category) {
      case "ARITHMETIC":
      {
        switch (linker.name) {
          case "Equality":
          {
            // SOLO ASIGNABLE A PROPIEDADES.
            response = (nodeToLink.type=="PROPERTY") ? true : false;
          }break;
          case "Less than":
          {
            // SOLO ASIGNABLE A PROPIEDADES.
            response = (nodeToLink.type=="PROPERTY") ? true : false;
          }break;
          case "Less or Equal":
          {
            // SOLO ASIGNABLE A PROPIEDADES.
            response = (nodeToLink.type=="PROPERTY") ? true : false;
          }break;
          case "Greater than":
          {
            // SOLO ASIGNABLE A PROPIEDADES.
            response = (nodeToLink.type=="PROPERTY") ? true : false;
          }break;
          case "Greater or equal":
          {
            // SOLO ASIGNABLE A PROPIEDADES.
            response = (nodeToLink.type=="PROPERTY") ? true : false;
          }break;
          case "Distinct":
          {
            // SOLO ASIGNABLE A PROPIEDADES.
            response = (nodeToLink.type=="PROPERTY") ? true : false;
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
