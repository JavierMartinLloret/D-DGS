import { Component, OnInit } from '@angular/core';
import { DataSet } from 'vis-data';
import { Network } from 'vis-network';

@Component({
  selector: 'app-test-diagram',
  templateUrl: './test-diagram.component.html',
  styleUrls: ['./test-diagram.component.css']
})
export class TestDiagramComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var nodes = new DataSet([
      { id: 1, label: "Nodo 1" },
      { id: 2, label: "Nodo 2" }
    ]);

    var edges = new DataSet([
      { id:1, from: 1, to: 2 }
    ]);

    var data = {
      nodes: nodes,
      edges: edges
    }

    var options = {};

    var container = document.getElementById("mynetwork");

    if(container != null)
      var network = new Network(container, data, options);
  }
}
