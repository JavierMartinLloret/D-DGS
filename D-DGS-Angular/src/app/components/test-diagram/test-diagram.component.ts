import { Component, OnInit } from '@angular/core';
import { DataSet } from 'vis-data';
import { Timeline } from 'vis-timeline';

@Component({
  selector: 'app-test-diagram',
  templateUrl: './test-diagram.component.html',
  styleUrls: ['./test-diagram.component.scss']
})
export class TestDiagramComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var aux = document.getElementById("visualization");
    if(aux != null)
    {
      var container: HTMLElement = aux;
      var items = new DataSet([
        { id: 1, content: "item 1", start: "2014-04-20" },
        { id: 2, content: "item 2", start: "2014-04-14" },
        { id: 3, content: "item 3", start: "2014-04-18" },
        { id: 4, content: "item 4", start: "2014-04-16", end: "2014-04-19" },
        { id: 5, content: "item 5", start: "2014-04-25" },
        { id: 6, content: "item 6", start: "2014-04-27", type: "point" },
      ]);
    
      var options = {};
    
      var timeLine = new Timeline(container, items, options);
    }
  }
}
