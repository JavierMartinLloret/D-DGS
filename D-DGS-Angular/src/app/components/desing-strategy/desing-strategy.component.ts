import { Component, OnInit } from '@angular/core';

const LOG_TOKEN: string = "LOG_TOKEN";
const DIAGRAM_TOKEN: string = "DIAGRAM_EDITION_ENABLE"; // 'y' | 'n'

@Component({
  selector: 'app-desing-strategy',
  templateUrl: './desing-strategy.component.html',
  styleUrls: ['./desing-strategy.component.css']
})
export class DesingStrategyComponent implements OnInit {

  constructor() {
    console.log(sessionStorage.getItem(LOG_TOKEN));
    console.log(sessionStorage.getItem(DIAGRAM_TOKEN));
    
  }

  ngOnInit(): void {
  }

}
