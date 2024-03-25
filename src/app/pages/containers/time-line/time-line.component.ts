import { Component, OnInit } from '@angular/core';
import { ConnectingExternalRoutesService } from '../../../shared/services/connecting-external-routes/connecting-external-routes.service';

@Component({
  selector: 'time-line',
  templateUrl: './time-line.component.html',
  styleUrl: './time-line.component.scss'
})
export class TimeLineComponent implements OnInit {

  constructor(private connectingExternalRoutesService: ConnectingExternalRoutesService) { }
  ngOnInit(): void {
    console.log('TimeLineComponent 🃏')
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
