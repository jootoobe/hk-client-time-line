import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'time-line',
  templateUrl: './time-line.component.html',
  styleUrl: './time-line.component.scss'
})
export class TimeLineComponent implements OnInit {

  ngOnInit(): void {
    console.log('TimeLineComponent 🃏')
  }

}
