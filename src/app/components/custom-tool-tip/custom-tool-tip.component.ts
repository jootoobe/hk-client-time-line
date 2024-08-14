import { Component, OnInit, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'custom-tool-tip',
  templateUrl: './custom-tool-tip.component.html',
  styleUrls: ['./custom-tool-tip.component.scss'],
  encapsulation: ViewEncapsulation.None,  // Remover encapsulação


  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms',
          style({ opacity: 1 })
        )
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0ms',
          style({ opacity: 0 })
        )
      ])
    ])
  ]
})
export class CustomToolTipComponent implements OnInit {


  @Input() text!: string;

  @Input() contentTemplate!: TemplateRef<Element>;

  constructor() { }

  ngOnInit() {
  }

}
