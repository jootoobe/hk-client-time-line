import { AfterViewInit, Component, ElementRef, NgZone, OnInit, Renderer2, TemplateRef, ViewChild, effect, output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TimeLineModel } from '../../../../models/time-line.model';
import { TimeLineService } from '../../../../services/time-line.service';
import { TIMELINEKeysModel } from '../../../../models/cryptos/time-line-keys.model';
import { StateService } from '../../../../shared/services/state.service';
import { IndexDbTimeLineService } from '../../../../shared/services/storage/indexed-db-timeline-store.service';
import { switchMap } from 'rxjs';
import { FlagModel, FlagsModel } from '../../../../models/flag.model';
import { environment } from '../../../../../environments/environment';
import { ConnectingExternalRoutesService } from '../../../../shared/services/connecting-external-routes/connecting-external-routes.service';
import { DetectBrowserNameService } from '../../../../shared/services/detect-browser-name.service';
import { ToastrService } from 'ngx-toastr';
import { TimeLineGetKanbanService } from '../../../../services/time-line-get-kanban.service';
import { FilterFlagsService } from '../../../../shared/services/filter-flags.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'flags-spider',
  templateUrl: './flags-spider.component.html',
  styleUrls: ['./flags-spider.component.scss']
})
export class FlagsSpiderComponent implements OnInit, AfterViewInit {
  @ViewChild('openClose', { static: true }) openClose!: ElementRef //  relating to the method openCloseHorizontalScroll()


  @ViewChild('createTimeLine', { static: false }) createTimeLine!: TemplateRef<any> // open modal ref - modal to create or edit timeline

  assetsProd = environment.assetsProd // assetsProd: 'http://localhost:4201',

  timeLine: TimeLineModel = {} as any

  timeLineKeys!: TIMELINEKeysModel
  editFlagForm!: FlagModel | any
  flagCreateEdit!: string

  envProd = environment.production

  // resetFlags!: TimeLineModel
  oldVersionFlags!: TimeLineModel
  detectBrowser!: string // used to identify the firefox browser and send an alter to the user
  openColse = true // used to show and hide the horizontal scroll
  flagLength = 0 // used to adjust the horizontal line style, to show and hide the word end



  valFilterColorBar = { color_hex: '', color_rgb: 0 } as any // stores the clicked filter bar and communicates with the top-div component
  checkingOpacityFilterApplied = '' // verifica se o filtro no modal está ativo ou não

  TOAST: any

  lastHeight!: number
  isAddressBarVisible: boolean = true
  heightTolerance: number = 10; // Tolerância para variação de altura

  isMobile: boolean = false;


  constructor(
    private dialogCreate: MatDialog,
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private timeLineService: TimeLineService,
    private stateService: StateService,
    private indexDbTimeLineService: IndexDbTimeLineService,
    private connectingExternalRoutesService: ConnectingExternalRoutesService,
    private detectBrowserNameService: DetectBrowserNameService,
    private timeLineGetKanbanService: TimeLineGetKanbanService,
    private toastrService: ToastrService,
    private filterFlagsService: FilterFlagsService,
    private ngZone: NgZone,
    private deviceService: DeviceDetectorService
  ) {

    this.indexDbGetAllTimeLine('0000')

    effect(() => { // tenho que certificar que a chave esteja lo LS - chave ss que abre o body {a: 'asdasd..}
      this.timeLineKeys = this.stateService.keysCryptoTimeLineSignalComputed()
      // if (this.timeLineKeys && this.timeLineKeys?.LS?.ss) {
      //   // this.getAllTimeLineById()
      // }
    })

    this.stateService.getAllTimeLineSubject$
      .subscribe({
        next: (res: TimeLineModel) => {
          // let val: any = {}
          // this.timeLine = val
          if (res && res.time_line) {
            this.timeLine = res
            this.flagLength = this.timeLine.time_line?.flags?.length

          }
        },
        error: () => { },
        complete: () => { }
      })


    effect(() => {
      this.TOAST = this.stateService.toastSignalComputed()
    })


    effect(() => {
      let getTimeLineHttp = this.stateService.getTimeLineHttpSignalSignalComputed()
      if (getTimeLineHttp) {
        this.getTimeLineKanbanById()

      }
    })


  }


  ngOnInit(): void {
    this.isMobile = this.deviceService.isMobile();
    this.detectBrowser = this.detectBrowserNameService.detectBrowserName()

    if (this.isMobile) {
      this.isAddressBarVisible = false
    } else if (!this.isMobile) {
      this.isAddressBarVisible = true
    }

    // this.timeLine.time_line.flags[0].flags2
    // let newHideIcon: any = localStorage.getItem('icon-visible') !== null ? localStorage.getItem('icon-visible') : 'false'
    // newHideIcon === 'false' ? false : true
    // this.isAddressBarVisible = newHideIcon

    this.detectAddressBar();


    setTimeout(() => {
      this.getTimeLineKanbanById()
      // this.getAllTimeLineById()
      this.openCloseHorizontalScroll('open')
    }, 1000)



  }

  ngAfterViewInit(): void { }


  editFlagEvent(flag: FlagModel) {
    this.editFlagForm = flag
    this.openCreateTimeLineDialog('edit')
  }


  closeModalEvent(e: any) {
    this.dialogCreate.closeAll()
  }

  // Open Create Time_Line
  openCreateTimeLineDialog(val: string): void {
    this.flagCreateEdit = val

    if (val === 'create') {
      this.editFlagForm = {}
    }

    this.dialogCreate.open(this.createTimeLine, {
      disableClose: true,
      panelClass: 'create-flag-dialog',
      // backdropClass: 'backdropBackground',
      position: {}
    });

  }


  getTimeLineKanbanById() {
    this.timeLineGetKanbanService.getTimeLineKanbanById()
      .subscribe({
        next: (res: any) => {

          let kanbans = res.sort((a: any, b: any) => a.kanbans.track_position_id - b.kanbans.track_position_id);

          this.getAllTimeLineById(kanbans, true)
        },
        error: (err) => {
          this.stateService.updateGetTimeLineHttpSignal(false)
          // let newTimeLine = { time_line: { flags: [] } }
          // this.stateService.updateGetAllTimeLine(newTimeLine)
          // end-loader
          if (err.error.code === 3053) { // KANBAN não exite ainda -- deve ser criado
            this.getAllTimeLineById([], true)
            return
          }
          this.connectingExternalRoutesService.spiderShareLoader({ message: false })
          //('Tente atualizar a página', 'Erro carregamento time-line');
          this.toastrService.error(this.TOAST['TIME-LINE']['FlagsSpiderComponent'].error['msn-0']['message-0'], this.TOAST['TIME-LINE']['FlagsSpiderComponent'].error['msn-0']['message-1']);

        },
        complete: () => {
          this.stateService.updateGetTimeLineHttpSignal(false)
        }
      })


  }





  getAllTimeLineById(kanban: any[], val?: boolean) {
    let newFlag: any = []


    this.timeLineService.getAllTimeLineById()
      .subscribe({
        next: (res: TimeLineModel[]) => {

          // Apenas para atualizações de 'time_line', 'kanban' e 'spider_tube', todos os dados são enviados.
          // 'kanban' e 'spider_tube' têm um limite de tamanho de 500kb.
          // // Cada flag dá 2kb com descrição mínima
          // const objectSize = JSON.stringify(res).length * (2 / 1024); // Convert bytes to kilobytes
          // const sizeFile = Math.round(objectSize)

          // // isso dá um total aproximado de 1000 bandeiras --- ver depois o que fazer 
          // const trueOrFalse = sizeFile > 2000 ? true : false
          // console.log('sizeFile  LimitGuard 👈', sizeFile+'kb', trueOrFalse)


          // if (!val) {
          res.forEach((e: TimeLineModel, i: number) => {
            e.time_line.flags.forEach((e1: FlagModel, i1: number) => {

              if (e1.flags2 && e1.flags2.length > 0) {
                e1.flags2[0]._id = e._id
                if (val) {
                  e1.flags2[0].social_medias_chips = []
                }
              }

              if (val) {
                e1.social_medias_chips = []
              }
              newFlag.push(e1)
              newFlag[i]._id = e._id

            })
          })
          // }


          if (val) {
            // Percorre cada flag em newFlag
            newFlag.forEach((flag: any) => {
              // Verifica se há kanban para processar
              if (kanban?.length > 0) {
                // Percorre cada item no kanban
                kanban.forEach((e1: any) => {
                  const trackSocialMedia = e1.kanbans.track_social_media;
                  const flagId = e1.kanbans.flag_id;

                  // Verifica se o track_social_media não é nulo e pertence à flag atual
                  if (trackSocialMedia && flag.flag_id === flagId) {
                    // Verifica se o track_social_media já existe em social_medias_chips dentro da flag
                    if (!flag.social_medias_chips.some((item: any) => item.name === trackSocialMedia)) {
                      flag.social_medias_chips.push({ name: trackSocialMedia });

                      // Ordena o array social_medias_chips em ordem alfabética
                      // flag.social_medias_chips.sort((a: any, b: any) => a.name.localeCompare(b.name));
                    }
                  }

                  // Verifica se há flags2 e se o track_social_media pertence à flags2
                  if (flag.flags2 && flag.flags2.length > 0 && flag.flags2[0].flag_id === flagId) {
                    // Verifica se o track_social_media já existe em social_medias_chips dentro de flags2
                    if (!flag.flags2[0].social_medias_chips.some((item: any) => item.name === trackSocialMedia)) {
                      flag.flags2[0].social_medias_chips.push({ name: trackSocialMedia });

                      // Ordena o array social_medias_chips dentro de flags2 em ordem alfabética
                      // flag.flags2[0].social_medias_chips.sort((a: any, b: any) => a.name.localeCompare(b.name));
                    }
                  }
                });
              } else {
                // Se não houver kanban, limpa social_medias_chips para cada flag
                flag.social_medias_chips = [];
                if (flag.flags2 && flag.flags2.length > 0) {
                  flag.flags2[0].social_medias_chips = [];
                }
              }
            });
          }

          let newTimeLine: TimeLineModel = {
            time_line: {
              flags: newFlag
            }
          }

          newTimeLine.time_line.flags = this.filterFlagsService.filterOrderFlags(newTimeLine)


          // this.resetFlags = newTimeLine
          this.indexDbPutAllFlag(newTimeLine)
          // end-loader
          setTimeout(() => {
            this.connectingExternalRoutesService.spiderShareLoader({ message: false })
          }, 550)
        },
        error: (err) => {
          let newTimeLine = { time_line: { flags: [] } }
          this.indexDbPutAllFlag(newTimeLine)
          // end-loader
          this.connectingExternalRoutesService.spiderShareLoader({ message: false })

          if (err.error.code !== 2009) { // não exite ainda -- deve ser criado
            //('Tente atualizar a página', 'Erro carregamento time-line');
            this.toastrService.error(this.TOAST['TIME-LINE']['FlagsSpiderComponent'].error['msn-0']['message-0'], this.TOAST['TIME-LINE']['FlagsSpiderComponent'].error['msn-0']['message-1']);
          }


        },
        complete: () => {
        }
      })
  }

  timeLineEvent(event: TimeLineModel) {
    this.timeLine = event
  }

  indexDbPutAllFlag(newTimeLine: TimeLineModel) {
    // let getNewVal = JSON.parse(localStorage.getItem('flags') || '[]');
    const connTimeLine$ = this.indexDbTimeLineService.connectToIDBTimeLine();
    connTimeLine$.pipe(
      switchMap(() =>
        this.indexDbTimeLineService.indexDbPutAllTimeLine("time_line", {
          year: '0000',
          time_line: newTimeLine.time_line
        })))
      .subscribe({
        next: (res: TimeLineModel) => {
          this.updateSocialMediasChipsFlag(res)
        },
        error: (err) => { },
        complete: () => {
          // this.indexDbGetAllTimeLine('0000')
        }
      })
  }


  updateSocialMediasChipsFlag(timeLine: TimeLineModel) {

    let differentFile = false
    let newFlag: FlagModel | any
    let newFlag2: FlagModel | any

    // if (this.oldVersionFlags && this.oldVersionFlags?.time_line.flags?.length > 0) {

    //   // Percorre cada flag na versão antiga
    //   this.oldVersionFlags?.time_line.flags?.forEach((oldFlag: FlagModel, flagIndex: number) => {
    //     // Busca a flag correspondente na nova versão
    //     newFlag = timeLine?.time_line.flags[flagIndex];

    //     // Verifica se as flags têm o mesmo ID
    //     if (oldFlag?.flag_id === newFlag?.flag_id) {
    //       // Verifica se os comprimentos dos arrays social_medias_chips são diferentes
    //       if (oldFlag?.social_medias_chips?.length !== newFlag?.social_medias_chips?.length || newFlag?.social_medias_chips?.length === 0) {
    //         differentFile = true;
    //       } else {
    //         // Percorre cada social_media_chip na flag antiga
    //         oldFlag?.social_medias_chips?.forEach((oldChip: any, chipIndex: number) => {
    //           // Busca o social_media_chip correspondente na nova versão
    //           const newChip = newFlag?.social_medias_chips[chipIndex];

    //           // // Ordena os arrays novamente antes da comparação, se necessário
    //           // oldFlag.social_medias_chips.sort((a: any, b: any) => a.name.localeCompare(b.name));
    //           // newFlag.social_medias_chips.sort((a: any, b: any) => a.name.localeCompare(b.name));


    //           // Verifica se os nomes são diferentes
    //           if (oldChip?.name !== newChip?.name || newFlag?.social_medias_chips?.length === 0) {
    //             differentFile = true;
    //           }
    //         });
    //       }

    //       // Verificação para flags2, garantindo que flags2 existe em ambas versões
    //       if (oldFlag?.flags2 && newFlag?.flags2) {
    //         oldFlag?.flags2?.forEach((oldFlag2: FlagModel, flag2Index: number) => {
    //           newFlag2 = newFlag?.flags2[flag2Index];

    //           // Verifica se os comprimentos dos arrays social_medias_chips são diferentes em flags2
    //           if (oldFlag2?.social_medias_chips?.length !== newFlag2?.social_medias_chips?.length) {
    //             differentFile = true;
    //           } else {
    //             // Percorre cada social_media_chip na flag2 antiga
    //             oldFlag2?.social_medias_chips?.forEach((oldChip2: any, chip2Index: number) => {
    //               // Busca o social_media_chip correspondente na nova versão
    //               const newChip2 = newFlag2?.social_medias_chips[chip2Index];

    //               // // Ordena os arrays social_medias_chips dentro de flags2 antes de comparar
    //               // oldFlag2.social_medias_chips.sort((a: any, b: any) => a.name.localeCompare(b.name));
    //               // newFlag2.social_medias_chips.sort((a: any, b: any) => a.name.localeCompare(b.name));


    //               // Verifica se os nomes são diferentes
    //               if (oldChip2?.name !== newChip2?.name) {
    //                 differentFile = true;
    //               }
    //             });
    //           }
    //         });
    //       }

    //     }
    //   });
    // }


    this.stateService.updateGetAllTimeLine(timeLine)
    // Quando há apenas uma bandeira, essa condição causa problemas na hora de deletar.
    // Essa condição só é atualizada quando há uma bandeira.
    // if (timeLine.time_line && timeLine.time_line.flags && timeLine.time_line.flags.length === 1) {

    //   this.timeLineService.updateSocialMediasChipsFlag(timeLine)
    //     .subscribe({
    //       next: (res: any) => { },
    //       error: (err) => { },
    //       complete: () => { }
    //     })
    //   return
    // }

    // if (differentFile) {
    timeLine.year = undefined
    delete timeLine.year
    timeLine.iam_id = '0'
    // this.stateService.updateGetAllTimeLine(timeLine)


    // this.stateService.updateGetAllTimeLine(timeLine)

    this.timeLineService.updateSocialMediasChipsFlag(timeLine)
      .subscribe({
        next: (res: any) => { },
        error: (err) => { },
        complete: () => { }
      })
    return
    // }
    // else {
    //   console.log('TIME_LINE>>>>>>>>>>>>..',timeLine)
    //   this.stateService.updateGetAllTimeLine(timeLine)
    // }
  }


  indexDbGetAllTimeLine(yearKey: string) {
    const connTimeLine$ = this.indexDbTimeLineService.connectToIDBTimeLine();
    connTimeLine$.pipe(
      switchMap(() =>
        this.indexDbTimeLineService.indexDbGetAllTimeLine('time_line', yearKey)
      ))
      .subscribe({
        next: (res: TimeLineModel) => {
          let valFlags: FlagModel[] = res.time_line.flags
          let newTimeLine = {
            time_line: {
              flags: valFlags
            }
          }
          this.oldVersionFlags = newTimeLine
          // this.resetFlags = newTimeLine
          // this.stateService.updateGetAllTimeLine(newTimeLine)
        },
        error: (err) => {
        },
        complete: () => {
        }
      })
  }


  // horizontal scroll button open and close
  // Levar para aplicação principal
  openCloseHorizontalScroll(val: string) {
    if (val === 'open') {
      this.openColse = true
    } else if (val === 'close') {
      this.openColse = false
    }
    // const open = this.openClose.nativeElement.querySelector("#open");
    // const close = this.openClose.nativeElement.querySelector("#close");

    // Para você ter uma melhor experiência visual utilize outro browser como Opera, Chrome, Edge ..... 😄
    if (this.detectBrowser === 'firefox') {
      alert(this.TOAST['TIME-LINE']['FlagsSpiderComponent'].alert['msn-0']['message'])
    }

    // // if (this.detectBrowser !== 'firefox') {
    // if (val === 'open') {
    //   // open.style.opacity = '0';
    //   // close.style.opacity = '1';
    //   this.openColse = true
    //   open.style.display = 'none';
    //   close.style.display = 'inline-table';
    //   return
    // } else if (val === 'close') {
    //   this.openColse = false
    //   // open.style.opacity = '1';
    //   // close.style.opacity = '0';
    //   open.style.display = 'inline-table';
    //   close.style.display = 'none';

    //   return
    // }
    // // }

    // open.style.display = 'none';
    // close.style.display = 'none';
  }




  // 🅰️ FOR MOBILE
  // Usado apenas para esconder o botão do vídeo quando está no mobile e a barra de endereço some
  detectAddressBar() {
    this.lastHeight = window.innerHeight;
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('resize', () => {
        this.ngZone.run(() => {
          const currentHeight = window.innerHeight;
          const heightDifference = this.lastHeight - currentHeight;

          // // Se a diferença na altura for significativa e a altura atual for menor
          // if (heightDifference > this.heightTolerance) {
          //   this.isAddressBarVisible = false; // A altura diminuiu, a barra está visível
          //   localStorage.setItem('icon-visible', 'false')
          // }
          // if (heightDifference < this.heightTolerance) {
          //   this.isAddressBarVisible = true;  // A altura aumentou, a barra está oculta 
          //   localStorage.setItem('icon-visible', 'true')
          // }

          // // Atualiza a altura para a próxima comparação
          // this.lastHeight = currentHeight;

          if (this.isMobile) {
            this.isAddressBarVisible = currentHeight === this.lastHeight ? false : heightDifference > this.heightTolerance ? false : true;
            this.lastHeight = currentHeight;
          } else if (!this.isMobile) {
            this.isAddressBarVisible = true
          }

        });
      });
    });
  }
}






// getAllTimeLineById(kanban: any[], val?: boolean) {
//   let newFlag: any = []


//   this.timeLineService.getAllTimeLineById()
//     .subscribe({
//       next: (res: TimeLineModel[]) => {



//         // if (!val) {
//         res.forEach((e: TimeLineModel, i: number) => {
//           e.time_line.flags.forEach((e1: FlagModel, i1: number) => {

//             if (e1.flags2 && e1.flags2.length > 0) {
//               e1.flags2[0]._id = e._id
//             }

//             // e1.social_medias_chips = [] não pode ter quando deleta
//             newFlag.push(e1)
//             newFlag[i]._id = e._id

//           })
//         })
//         // }


//         if (val) {
//           // res.forEach((e: TimeLineModel, i: number) => {
//           //   e.time_line.flags.forEach((e1: FlagModel, i1: number) => {
//           //     e1.social_medias_chips = []
//           //     newFlag.push(e1)
//           //     newFlag[i]._id = e._id
//           //   })
//           // })

//           newFlag.forEach((e: FlagModel, i: number) => {
//             if (kanban?.length > 0) {
//               kanban.forEach((e1: any, i1: number) => {
//                   // ADD social_medias_chips FLAG1
//                 if (e.flag_id === e1.kanbans.flag_id && e1.kanbans.track_social_media) {
//                   let filter = newFlag[i]?.social_medias_chips?.filter((val: any) => val?.name === e1.kanbans.track_social_media);
//                   if (filter?.length === 0) {
//                     e.social_medias_chips.push({ name: e1.kanbans.track_social_media })
//                   }
//                 }

//                 // ADD social_medias_chips FLAG2
//                 if (e.flags2 && e.flags2[0].flag_id === e1.kanbans.flag_id && e1.kanbans.track_social_media) {
//                   let filter2 = e.flags2[0]?.social_medias_chips?.filter((val: any) => val?.name === e1.kanbans.track_social_media);
//                   if (filter2?.length === 0) {
//                     e.flags2[0].social_medias_chips.push({ name: e1.kanbans.track_social_media })
//                   }
//                 }
//               })
//             } else if (kanban.length === 0) {
//               e.social_medias_chips = []
//             }
//           })
//         }

//         let newTimeLine: TimeLineModel = {
//           time_line: {
//             flags: newFlag
//           }
//         }

//         newTimeLine.time_line.flags = this.filterFlagsService.filterOrderFlags(newTimeLine)


//         this.resetFlags = newTimeLine
//         this.indexDbPutAllFlag(newTimeLine)
//         // end-loader
//         setTimeout(() => {
//           this.connectingExternalRoutesService.spiderShareLoader({ message: false })
//         }, 2000)
//       },
//       error: (err) => {
//         let newTimeLine = { time_line: { flags: [] } }
//         this.indexDbPutAllFlag(newTimeLine)
//         // end-loader
//         this.connectingExternalRoutesService.spiderShareLoader({ message: false })

//         if (err.error.code !== 2009) { // não exite ainda -- deve ser criado
//           //('Tente atualizar a página', 'Erro carregamento time-line');
//           this.toastrService.error(this.TOAST['TIME-LINE']['FlagsSpiderComponent'].error['msn-0']['message-0'], this.TOAST['TIME-LINE']['FlagsSpiderComponent'].error['msn-0']['message-1']);
//         }


//       },
//       complete: () => {
//       }
//     })
// }