import { Component, OnInit, Renderer2 } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-time-line', // Os seletores dos projetos devem esta identicos a seus microserviços
  templateUrl: './app-time-line.component.html',
  styleUrls: ['./app-time-line.component.scss']
})
export class AppTimeLineComponent implements OnInit {
  title = 'hk-client-time-line';
  styleSpiderShare = environment.styleSpiderShare


  constructor(private renderer: Renderer2,) {
    let styleCss = localStorage.getItem('st') !== null ? localStorage.getItem('st') : undefined

    const link = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', 'stylesheet');
    this.renderer.setAttribute(link, 'href', `${this.styleSpiderShare}/styles-${styleCss}.css`);
    this.renderer.appendChild(document.head, link);
    console.log(`${this.styleSpiderShare}/styles-${styleCss}.css`)
    // http://localhost:4200/styles-CUIQ32FR.css
  }
  ngOnInit(): void {
    console.log('AppTimeLineComponent')
  }
}
