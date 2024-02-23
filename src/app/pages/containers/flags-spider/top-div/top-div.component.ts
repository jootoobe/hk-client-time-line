import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'top-div',
  templateUrl: './top-div.component.html',
  styleUrl: './top-div.component.scss'
})
export class TopDivComponent implements OnInit {

  ngOnInit(): void {
    console.log('TopDivComponent')
  }

}
