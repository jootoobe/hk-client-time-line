import { ConnectingExternalRoutesService } from '../../../../../shared/connecting-external-routes/connecting-external-routes.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'top-div',
  templateUrl: './top-div.component.html',
  styleUrl: './top-div.component.scss'
})
export class TopDivComponent implements OnInit {

  constructor(private connectingExternalRoutesService: ConnectingExternalRoutesService) { }
  ngOnInit(): void {
    console.log('TopDivComponent 🃏')
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
    this.connectingExternalRoutesService.navigateKanban(routerKanban)
  }

  navigateSpiderTube(data: string) {
    let routerSpiderTube = {}
    routerSpiderTube = {
      router: data,
      message: undefined
    }
    this.connectingExternalRoutesService.navigateSpiderTube(routerSpiderTube)
  }


}
