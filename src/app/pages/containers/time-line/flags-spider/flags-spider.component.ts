import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild, effect, output } from '@angular/core';
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
      if(getTimeLineHttp) {
        console.log('PPPPPPPPPPPPPPPPPPPPPPPPPPPPp BUUUUUCCETA')
        this.getTimeLineKanbanById()
        
      }
    })


  }


  ngOnInit(): void {
    this.detectBrowser = this.detectBrowserNameService.detectBrowserName()

    console.log('FlagsSpiderComponent 🃏')


    setTimeout(() => {
      this.getTimeLineKanbanById()
      // this.getAllTimeLineById()
      this.openCloseHorizontalScroll('open')
    }, 1000)


  
  }

  ngAfterViewInit(): void { }

  getFlagEvent(e: any) {
    let newTimeLine = {
      time_line: {
        flags: []
      }
    }

    this.oldVersionFlags = newTimeLine
    this.getAllTimeLineById([], false)
  }

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

          console.log('TIME LINE GET KANBAN 🎅', res)

          this.getAllTimeLineById(kanbans, true)
        },
        error: (err) => {
          this.stateService.updateGetTimeLineHttpSignal(false)
          console.log('EEEROOOOOOOOOOOOOOOOOOOOOOO', err)
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
          console.log('ENTROU ENTROU')
          this.stateService.updateGetTimeLineHttpSignal(false)
        }
      })
      
      
  }





  getAllTimeLineById(kanban: any[], val?: boolean) {
    let newFlag: any = []


    this.timeLineService.getAllTimeLineById()
      .subscribe({
        next: (res: TimeLineModel[]) => {

          console.log('GET TIME LINE 🎅🎅🎅', val)


          // if (!val) {
          res.forEach((e: TimeLineModel, i: number) => {
            e.time_line.flags.forEach((e1: FlagModel, i1: number) => {

              if (e1.flags2 && e1.flags2.length > 0) {
                e1.flags2[0]._id = e._id
                if(val) {
                  e1.flags2[0].social_medias_chips = []
                }
              }

              if(val) {
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
          }, 2000)
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
    console.log('ATUAL', timeLine)
    console.log('ANTIGO', this.oldVersionFlags)
    let differentFile = false
    let newFlag: FlagModel | any
    let newFlag2: FlagModel | any
    if (this.oldVersionFlags && this.oldVersionFlags?.time_line.flags?.length > 0) {
      // Percorre cada flag na versão antiga
      this.oldVersionFlags?.time_line.flags?.forEach((oldFlag: FlagModel, flagIndex: number) => {
        // Busca a flag correspondente na nova versão
        newFlag = timeLine?.time_line.flags[flagIndex];

        // Verifica se as flags têm o mesmo ID
        if (oldFlag.flag_id === newFlag.flag_id) {
          // Verifica se os comprimentos dos arrays social_medias_chips são diferentes
          if (oldFlag?.social_medias_chips?.length !== newFlag?.social_medias_chips?.length) {
            differentFile = true;
            console.log(`DIFERENTE COMPRIMENTO DOS ARRAYS em flag_id: ${oldFlag.flag_id}`);
          } else {
            // Percorre cada social_media_chip na flag antiga
            oldFlag?.social_medias_chips?.forEach((oldChip: any, chipIndex: number) => {
              // Busca o social_media_chip correspondente na nova versão
              const newChip = newFlag?.social_medias_chips[chipIndex];

              // // Ordena os arrays novamente antes da comparação, se necessário
              // oldFlag.social_medias_chips.sort((a: any, b: any) => a.name.localeCompare(b.name));
              // newFlag.social_medias_chips.sort((a: any, b: any) => a.name.localeCompare(b.name));


              // Verifica se os nomes são diferentes
              if (oldChip.name !== newChip.name) {
                differentFile = true;
                console.log(`EXISTE ARRAY NAME DIFERENTE em flag_id: ${oldFlag.flag_id}, chip_index: ${chipIndex}`);
              }
            });
          }

          // Verificação para flags2, garantindo que flags2 existe em ambas versões
          if (oldFlag.flags2 && newFlag.flags2) {
            oldFlag?.flags2?.forEach((oldFlag2: FlagModel, flag2Index: number) => {
              newFlag2 = newFlag?.flags2[flag2Index];

              console.log('TESTE', newFlag2)

              // Verifica se os comprimentos dos arrays social_medias_chips são diferentes em flags2
              if (oldFlag2?.social_medias_chips?.length !== newFlag2?.social_medias_chips?.length) {
                differentFile = true;
                console.log(`DIFERENTE COMPRIMENTO DOS ARRAYS em flag2_id: ${oldFlag2.flag_id}`);
              } else {
                // Percorre cada social_media_chip na flag2 antiga
                oldFlag2?.social_medias_chips?.forEach((oldChip2: any, chip2Index: number) => {
                  // Busca o social_media_chip correspondente na nova versão
                  const newChip2 = newFlag2?.social_medias_chips[chip2Index];

                  // // Ordena os arrays social_medias_chips dentro de flags2 antes de comparar
                  // oldFlag2.social_medias_chips.sort((a: any, b: any) => a.name.localeCompare(b.name));
                  // newFlag2.social_medias_chips.sort((a: any, b: any) => a.name.localeCompare(b.name));


                  // Verifica se os nomes são diferentes
                  if (oldChip2.name !== newChip2.name) {
                    differentFile = true;
                    console.log(`EXISTE ARRAY NAME DIFERENTE em flag2_id: ${oldFlag2.flag_id}, chip2_index: ${chip2Index}`);
                  }
                });
              }
            });
          }

        }
      });
    }

    // Só para garanit 
    this.connectingExternalRoutesService.spiderShareLoader({ message: false })

    if (differentFile) {
      timeLine.year = undefined
      delete timeLine.year
      timeLine.iam_id = '0'
      console.log(timeLine)
      // this.stateService.updateGetAllTimeLine(timeLine)

      this.timeLineService.updateSocialMediasChipsFlag(timeLine)
        .subscribe({
          next: (res: any) => {
            this.stateService.updateGetAllTimeLine(timeLine)
          },
          error: (err) => { },
          complete: () => { }
        })
      return
    } else {
      this.stateService.updateGetAllTimeLine(timeLine)
    }
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
          console.log('ANTIGO 🌝', this.oldVersionFlags)
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
    const open = this.openClose.nativeElement.querySelector("#open");
    const close = this.openClose.nativeElement.querySelector("#close");

    // Para você ter uma melhor experiência visual utilize outro browser como Opera, Chrome, Edge ..... 😄
    if (this.detectBrowser === 'firefox') {
      alert(this.TOAST['TIME-LINE']['FlagsSpiderComponent'].alert['msn-0']['message'])
    }

    // if (this.detectBrowser !== 'firefox') {
    if (val === 'open') {
      // open.style.opacity = '0';
      // close.style.opacity = '1';
      this.openColse = true
      open.style.display = 'none';
      close.style.display = 'inline-table';
      return
    } else if (val === 'close') {
      this.openColse = false
      // open.style.opacity = '1';
      // close.style.opacity = '0';
      open.style.display = 'inline-table';
      close.style.display = 'none';
      return
    }
    // }

    open.style.display = 'none';
    close.style.display = 'none';
  }

}





// getAllTimeLineById(kanban: any[], val?: boolean) {
//   let newFlag: any = []


//   this.timeLineService.getAllTimeLineById()
//     .subscribe({
//       next: (res: TimeLineModel[]) => {

//         console.log('GET TIME LINE 🎅🎅🎅', res)


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
//                 console.log('ssssssss', e1.kanbans.track_social_media)
//                 console.log('ssssssss', newFlag[i])
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