import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { ConnectingExternalRoutesService } from '../../../../shared/connecting-external-routes/connecting-external-routes.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'flags-spider',
  templateUrl: './flags-spider.component.html',
  styleUrls: ['./flags-spider.component.scss']
})
export class FlagsSpiderComponent implements OnInit {
  assetsProd = environment.assetsProd // assetsProd: 'http://localhost:4201',


  constructor(private connectingExternalRoutesService: ConnectingExternalRoutesService) { }
  ngOnInit(): void {
    console.log('FlagsSpiderComponent 🃏')
  }


  navigateHomeSpider(data: string) {

    let routerHomeSpider = {}
    routerHomeSpider = {
      router: data,
      message: undefined
    }
    this.connectingExternalRoutesService.navigateHomeSpider(routerHomeSpider)
  }

  navigateKanban(data: string) {
    let routerKanban = {}
    routerKanban = {
      router: data,
      message: undefined
    }
    this.connectingExternalRoutesService.navigateHomeSpider(routerKanban)
  }

  navigateSpiderTube(data: string) {
    let routerSpiderTube = {}
    routerSpiderTube = {
      router: data,
      message: undefined
    }
    this.connectingExternalRoutesService.navigateHomeSpider(routerSpiderTube)
  }
}
