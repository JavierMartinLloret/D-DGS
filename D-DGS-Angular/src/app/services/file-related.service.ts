import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileRelatedService {

  constructor(private _httpClient: HttpClient) { }

  private diagramURL: string = "http://localhost:3000/diagrams/download"

  downloadFileExample(fileName: string, format: string) {
    const downloadInstance = document.createElement("a");
      // Ruta del archivo a descargar
      downloadInstance.href = this.diagramURL+"/"+fileName;
      // Hace que el navegador no abra directamente la ruta
      downloadInstance.target = '_blank';

      document.body.appendChild(downloadInstance);
      downloadInstance.click();
      document.body.removeChild(downloadInstance);
  }

  getAJSONDiagram(diagramID: string) {
    let response;
    this._httpClient.get(this.diagramURL+"/"+diagramID);
  }
}