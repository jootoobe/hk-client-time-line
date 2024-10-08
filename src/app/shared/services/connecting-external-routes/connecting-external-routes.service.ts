import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectingExternalRoutesService {

  constructor() { }

  navigateHomeSpider(data?: any) {
    const routerHome = {
      router: data.router,
      message: data.message
    }
    const event = new CustomEvent('navigate-home-spider', { detail: routerHome, bubbles: true })
    dispatchEvent(event)
  }


  navigateKanban(data?: any) {
    let routerKanban = {}
    routerKanban = {
      router: data.router,
      message: data == undefined ? undefined : data.message
    }
    const event = new CustomEvent('navigate-kanban', { detail: routerKanban, bubbles: true })
    dispatchEvent(event)
  }


  navigateSpiderTube(data?: any) {
    const routerSpiderTube = {
      router: data.router,
      message: data == undefined ? undefined : data.message
    }
    const event = new CustomEvent('navigate-spider-tube', { detail: routerSpiderTube, bubbles: true })
    dispatchEvent(event)
  }

  spiderShareLoader(data?: any) {
    const routerSpiderTube = {
      router: '',
      message: data == undefined ? undefined : data.message
    }
    const event = new CustomEvent('spider-share-loader', { detail: routerSpiderTube, bubbles: true })
    dispatchEvent(event)
  }


  userPaymentValidate(data?: any) {
    const bodyTrimm = {
      userData: data,
      message: 'user payment time-line'
    }
    const event = new CustomEvent('user-payment-validate', { detail: bodyTrimm, bubbles: true })
    dispatchEvent(event)
  }




}
