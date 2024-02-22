import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'flags-spider',
  templateUrl: './flags-spider.component.html',
  styleUrls: ['./flags-spider.component.scss']
})
export class FlagsSpiderComponent implements OnInit, AfterViewInit {
  sss = false
  constructor( ) {  }

  ngOnInit() {
    console.log('FlagsSpiderComponent 🌝')

   }

  ngAfterViewInit(): void {
  }



}
