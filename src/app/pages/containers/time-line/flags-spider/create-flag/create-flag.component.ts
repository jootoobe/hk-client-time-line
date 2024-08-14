import { style } from '@angular/animations';
import { DatePipe } from "@angular/common";
import { AfterViewInit, Component, Inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild, effect, output } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatRadioChange } from "@angular/material/radio";
import { ToastrService } from "ngx-toastr";
import { debounceTime, distinctUntilChanged, switchMap, take, tap } from "rxjs";

import { MatDatepickerTimeHeaderComponent } from "../../../../../components/datepicker-time/mat-datepicker-time-header.component";
import { DateObjModel } from "../../../../../models/date-obj.model";
import { FlagModel } from "../../../../../models/flag.model";
import { TimeLineModel } from "../../../../../models/time-line.model";
import { TimeLineService } from "../../../../../services/time-line.service";
import { ConvertColorService } from "../../../../../shared/services/convert-color.service";
import { LatitudeLongitudeService } from "../../../../../shared/services/latitude-longitude.service";
import { StateService } from "../../../../../shared/services/state.service";
import { MyErrorStateMatcher } from "../../../../../shared/validators/err/invalid-control";
import { TolltipCreateHelper } from "./tolltip-create-helper";
import { IndexDbTimeLineService } from "../../../../../shared/services/storage/indexed-db-timeline-store.service";
import { ConnectingExternalRoutesService } from '../../../../../shared/services/connecting-external-routes/connecting-external-routes.service';
import { FilterFlagsService } from '../../../../../shared/services/filter-flags.service';
import { IFilterCheckActive } from '../../../../../interfaces/filter-check-active.interface';
import { EncryptDecryptModel } from '../../../../../models/encrypt-decrypt/encrypt-decrypt.model';
import { WINDOW } from '../../../../../shared/services/window.service';

@Component({
  selector: 'create-flag', // remove word app- from microservices
  templateUrl: './create-flag.component.html',
  styleUrls: ['./create-flag.component.scss',]
})

export class CreateFlagComponent implements OnChanges, OnInit, AfterViewInit {

  timeLine!: TimeLineModel
  @Input({ required: true }) editFlagFormInput!: FlagModel
  @Input({ required: true }) flagCreateEditInput!: string
  closeModalOutput = output()

  editFlag!: FlagModel;
  timestampExist!: FlagModel[];
  createEditFlagSubscribe!: TimeLineModel

  createTimeLineForm!: FormGroup
  matcher!: MyErrorStateMatcher // form validator errors

  disableColor = false
  colorHexaVal = ''

  // Datepicker timer
  timeHeader = MatDatepickerTimeHeaderComponent
  minDate = new Date('-100/01/01'); // lowest date accepted for creating the flag
  time = '12:00:00'

  @ViewChild(TolltipCreateHelper, { static: true }) tolltipCreateHelper!: TolltipCreateHelper;
  help1: string = ''
  help2: string = ''
  help3: string = ''
  help4: string = ''
  help5: string = ''
  help6: string = ''
  // RADIO BUTTON
  radioRedeTextColor = '0, 0, 0' // text colors
  radioRedeNets = '1' // {background: '74,74,74', text: '255,255,255'}
  radioButtonDate = '1' // cor fundo data com transparencia de 0.3
  radioRedeTransparency = '0.1' // transparência bandeira

  TOAST: any
  // language = ''
  addDataMaskVal = ''
  chipsArray!: FormArray | any

  TIME_LINE: any

  innerHeightVal!: number

  openColorCreat!: IFilterCheckActive
  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private convertColorService: ConvertColorService,
    private datePipe: DatePipe,
    private latitudeLongitudeService: LatitudeLongitudeService,
    private toastrService: ToastrService,
    private timeLineService: TimeLineService,
    private indexDbTimeLineService: IndexDbTimeLineService,
    private connectingExternalRoutesService: ConnectingExternalRoutesService,
    private filterFlagsService: FilterFlagsService,
    @Inject(WINDOW) private window: Window,
  ) {

    this.innerHeightVal = this.window.innerHeight

    effect(() => {
      this.TOAST = this.stateService.toastSignalComputed()
    })

    // effect(() => {
    //   this.language = this.stateService.languageSignalComputed()
    // })

    this.chipsArray = []
    this.buildForm()

    effect(() => {
      this.TIME_LINE = this.stateService.translatorLanguageSignalComputed()
      if (this.TIME_LINE) {
        this.help1 = this.tolltipCreateHelper.help1()
        this.help2 = this.tolltipCreateHelper.help2()
        this.help3 = this.tolltipCreateHelper.help3()
        this.help4 = this.tolltipCreateHelper.help4()
        this.help5 = this.tolltipCreateHelper.help5()
        this.help6 = this.tolltipCreateHelper.help6()
      }
    })

    this.stateService.getAllTimeLineSubject$
      .subscribe({
        next: (res: TimeLineModel) => {
          // let val: any = {}
          // this.timeLine = val
          if (res && res.time_line) {
            this.timeLine = res

          }
        },
        error: () => { },
        complete: () => { }
      })

    // Aqui serve para verificar se o input de cor é criado corretamente ao abrir.
    effect(() => {
      this.openColorCreat = this.stateService.activeFilterSignalComputed()
      console.log(this.openColorCreat)
    })

  }


  ngOnChanges(changes: SimpleChanges) {

    // Editing flag
    if (changes['editFlagFormInput']?.currentValue.flag_id) {
      this.editFlag = changes['editFlagFormInput']?.currentValue
      this.updateFlagobject(this.editFlag)
    }

  }

  ngOnInit(): void {
    this.latitudeLongitude()
  }

  ngAfterViewInit(): void {
    // setTimeout(() => { // aqui precisa de setTimeout para espear o tradutor carregar adequadamente
    //   this.help1 = this.tolltipCreateHelper.help1()
    //   this.help2 = this.tolltipCreateHelper.help2()
    //   this.help3 = this.tolltipCreateHelper.help3()
    //   this.help4 = this.tolltipCreateHelper.help4()
    //   this.help5 = this.tolltipCreateHelper.help5()
    //   this.help6 = this.tolltipCreateHelper.help6()
    // }, 500)

    this.setDateTimestamp()
  }


  // ⬇️ New Form TimeLineModel
  buildForm(): void {
    this.createTimeLineForm = this.fb.group({
      iam_id: new FormControl<string | null>('0', []),
      time_line: this.fb.group({
        flags: new FormArray([this.createFlagobject()])
      })
    });

  }

  createFlagobject(): FormGroup {
    let currentlyDate = this.datePipe.transform(new Date(), 'medium'); // Date.parse(newDate);

    return this.fb.group({
      year: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(4)]),
      flag_id: new FormControl<string | null>('flag_id_' + this.stateService.getUniqueId(8), [Validators.required, Validators.minLength(32), Validators.maxLength(47)]),
      flag_title: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      flag_description: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(500)]),
      flag_style: new FormControl<any | null>(null, [Validators.required]),
      flag_created_at: new FormControl<string | null>(currentlyDate, []),
      flag_update_at: new FormControl<string | null>('0', []),
      flag_margin_right: new FormControl<string | null>('0', []),
      flag_status_update: new FormControl<string | null>('', []),

      flag_design: this.fb.group({
        color_text: new FormControl<string | null>('0, 0, 0', [Validators.required]),
        color_transparency: new FormControl<string | null>('0.1', [Validators.required]),
        color_hex: new FormControl<string | null>('#90ab3d', [Validators.required]),
        color_rgb: new FormControl<string | null>('144, 171, 64', [Validators.required]),
        color_hsl: new FormControl<string | null>('75, 46%, 92%', [Validators.required]),
        color_date: new FormControl<string | null>('144, 171, 64', [Validators.required]),
        color_chips: this.fb.group({
          background: new FormControl<string | null>('74, 74, 74', [Validators.required]),
          text: new FormControl<string | null>('255, 255, 255', [Validators.required]),
        }),
      }),
      date_obj: this.fb.group({
        day_month_year: new FormControl<string | null>(null, [Validators.required, Validators.minLength(24)]), // A data day_month_year está com o horário certo
        date_origin: new FormControl<string | null>(null, [Validators.required, Validators.minLength(9), Validators.maxLength(10)]), // A data date_origin está com o horário errado - se tentar colocar o hotário certo da erro no  datepicker
        day: new FormControl<string | null>(null, [Validators.required]),
        month: new FormControl<string | null>(null, [Validators.required]),
        month_s: new FormControl<string | null>(null, []),
        year: new FormControl<string | null>(null, [Validators.required]),
        month_code: new FormControl<number | null>(0, [Validators.required]),
        timestamp: new FormControl<number | null>(null, [Validators.required]),
        time: new FormControl<string | null>(this.time, [Validators.required, Validators.minLength(8)]),
      }),
      social_medias_chips: new FormArray([]),
      subject_tags: new FormArray([]),

      geolocation: this.fb.group({
        country_name: new FormControl<string | null>(null, []),
        country_code: new FormControl<string | null>(null, []),
        state: new FormControl<string | null>(null, []),
        city: new FormControl<string | null>(null, []),
        longitude: new FormControl<number | null>(0, []),
        latitude: new FormControl<number | null>(0, []),
      }),
      flags2: new FormArray([]),
    });


  }
  // ⬇️ Get Flag form
  get flagsForm() {
    return this.createTimeLineForm.get('time_line')?.get('flags') as FormArray
  }


  updateFlagobject(flagVal: FlagModel) {

    // Aqui eu desabilito a cor da dandeira 02
    // A bandeira 02 não pode editar a cor
    // setTimeout(() => {
    //   let flags = this.createTimeLineForm.get('time_line')?.get('flags') as FormArray
    //   let twoFlagsPosition: any = []

    //   this.timeLine.time_line.flags.forEach((e: FlagModel, i: number) => {
    //     if (e.date_obj.timestamp === flags.at(0)?.get('date_obj')?.get('timestamp')?.value) {
    //       twoFlagsPosition.push(e)
    //     }
    //   })

    //   if (twoFlagsPosition[0].flags2?.length > 0) {
    //     this.disableColor = true
    //     // 'Deve ser igual a cor da bandeira 01', 'A babdeira 02'
    //     // this.toastrService.warning('Deve ser igual a cor da bandeira 01', 'A babdeira 02');

    //   }
    // }, 200)


    let currentlyDate = this.datePipe.transform(new Date(), 'medium'); // Date.parse(newDate);    

    if (flagVal.edit === 'edit-flag-1') {
      this.flagsForm.controls[0].patchValue(flagVal)

      if (this.editFlag && this.editFlag.social_medias_chips.length > 0) {
        this.chipsArray = (<FormArray>this.flagsForm.controls[0].get('social_medias_chips'))

        this.editFlag.social_medias_chips.forEach((e: any) => {
          this.chipsArray.push(new FormControl({ name: e.name }));
        })
      }
      this.convertColor()
    }

    if (flagVal.edit === 'edit-flag-2') {
      let newVal: any = flagVal.flags2
      this.flagsForm.controls[0].patchValue(newVal[0])

      if (this.editFlag.flags2 && this.editFlag.flags2?.length > 0) {
        this.chipsArray = (<FormArray>this.flagsForm.controls[0].get('social_medias_chips'))

        this.editFlag.flags2[0].social_medias_chips.forEach((e: any) => {
          this.chipsArray.push(new FormControl({ name: e.name }));
        })
      }
      // this.convertColor(this.flagsForm.at(0)?.get('flag_design')?.get('color_hex')?.value)
      this.convertColor()
    }

    this.flagsForm.controls[0]?.get('flag_update_at')?.setValue(currentlyDate)

    // o pipe | unique remove o ano
    this.flagsForm.controls[0]?.get('year')?.setValue(this.flagsForm.controls[0]?.get('date_obj')?.get('year')?.value)

    //tem que fazer isso para não dar um problema com o matDatepicker
    this.flagsForm.controls[0]?.get('date_obj')?.get('date_origin')?.setValue(new Date(flagVal.date_obj.date_origin))


    // UPDATE RADIO BUTTON
    this.radioRedeTextColor = this.flagsForm.controls[0]?.get('flag_design')?.get('color_text')?.value

    let val = this.flagsForm.controls[0]?.get('flag_design')?.get('color_chips')?.value

    if (val.background === '74, 74, 74' && val.text === '255, 255, 255') { //{background: 'black', text: 'white'}
      this.radioRedeNets = '1'
    }
    else if (val.background === '255, 255, 255' && val.text === '74, 74, 74') { //{background: 'white', text: 'black'}
      this.radioRedeNets = '2'
    }
    else if (val.background === '74, 74, 74' && val.text === '255, 0, 0') { //{background: 'black', text: 'red'}
      this.radioRedeNets = '3'
    }
    else if (val.background === '255, 0, 0' && val.text === '255, 255, 255') { //{background: 'red', text: 'white'}
      this.radioRedeNets = '4'
    }
    else if (val.background === '74, 74, 74' && val.text === '255, 255, 0') { //{background: 'black', text: 'yellow'}
      this.radioRedeNets = '5'
    }



    let val2 = this.flagsForm.controls[0]?.get('flag_design')?.get('color_date')?.value

    if (val2 === this.flagsForm.controls[0]?.get('flag_design')?.get('color_rgb')?.value) {  //   <!-- Mesma cor bandeira -->
      this.radioButtonDate = '1'
    }
    else if (val2 === '0, 0, 0') { // preto
      this.radioButtonDate = '2'
    }
    else if (val2 === '255, 255, 255') { //branco
      this.radioButtonDate = '3'
    }
    else if (val2 === '255, 0, 0') { //vermelho
      this.radioButtonDate = '4'
    }
    else if (val2 === '255, 255, 0') { // amarelo
      this.radioButtonDate = '5'
    }

    this.radioRedeTransparency = this.flagsForm.controls[0]?.get('flag_design')?.get('color_transparency')?.value
  }



  //================================= 🅰️🅰️ TIME STEMP 🅰️🅰️ ==============================
  //==============================================================================

  toggleDatePicker(ref: any) {
  }

  setDateTimestamp() {
    // GET DATE
    this.flagsForm.controls[0]?.get('date_obj')?.get('date_origin')?.valueChanges
      .pipe(
        debounceTime(800), // digitação dentro do intervalo, ele espera pra fazer a busca
        distinctUntilChanged(),// Se eu digitar uma query - ele vai permitir apenas as msn que são diferentes umas das outras
      ).subscribe({
        next: () => {
          if (this.time.length < 8) {
            this.flagsForm.controls[0]?.get('date_obj')?.get('date_origin')?.setValue('')
            //'É obrigatório', 'Horário'
            this.toastrService.error(this.TOAST['TIME-LINE']['CreateFlagComponent'].error['msn-0']['message-0'], this.TOAST['TIME-LINE']['CreateFlagComponent'].error['msn-0']['message-1']);
            return
          }
          if (this.time.length >= 8) {
            this.timestampDate()
          }
        },
        error: (err) => { },
        complete: () => { }
      })

    // GET TIME
    this.flagsForm.controls[0]?.get('date_obj')?.get('time')?.valueChanges
      .pipe(
        debounceTime(800), // digitação dentro do intervalo, ele espera pra fazer a busca
        distinctUntilChanged(),// Se eu digitar uma query - ele vai permitir apenas as msn que são diferentes umas das outras
      ).subscribe({
        next: (time: string) => {
          this.time = time

          if (time.length < 8) {
            this.flagsForm.controls[0]?.get('date_obj')?.get('date_origin')?.setValue('')
            return
          }
          if (time.length >= 8) {
            if (this.flagsForm.controls[0]?.get('date_obj')?.get('date_origin')?.value) {
              this.timestampDate()
            }
          }
        },
        error: (err) => { },
        complete: () => { }
      })
  }

  timestampDate() {
    this.disableColor = false
    this.timestampExist = []
    let datePicker: any = ''
    datePicker = this.flagsForm.controls[0]?.get('date_obj')?.get('date_origin')?.value

    datePicker = datePicker.toISOString() // convert to timestemp
    let date: string = `${datePicker.split('T').shift()}T${this.time}${datePicker?.substring(19)}`
    this.flagsForm.controls[0]?.get('year')?.setValue(datePicker.split('-')[0])

    let dateSplit = datePicker.split('-')
    let newTimestamp = Date.parse(date.toString())

    // Check if there are 01 or 02 identical timestamps
    if (this.timeLine && this.timeLine?.time_line) { // quando não existem bandeiras
      for (let flag of this.timeLine?.time_line?.flags) {
        if (flag.date_obj.timestamp === newTimestamp) {
          this.timestampExist.push(flag)
        }
      }
    }

    if (this.timestampExist[0]?.flags2?.length === 1) {
      this.flagsForm.controls[0]?.get('date_obj')?.patchValue(({
        day_month_year: '',
        day: '',
        month: '',
        month_s: '',
        month_code: '',
        year: '',
        timestamp: 0,
        // time,
      }), { emitEvent: false })

      //'Até 02 flags por data e horário', 'Máximo 02 flags'
      this.toastrService.warning(this.TOAST['TIME-LINE']['CreateFlagComponent'].warning['msn-0']['message-0'], this.TOAST['TIME-LINE']['CreateFlagComponent'].warning['msn-0']['message-1']);
      this.closeModalOutput.emit()
      return
    }

    if (this.timestampExist.length === 0) {
      this.flagsForm.controls[0]?.get('flag_style')?.setValue(1)
      this.convertColor()
    }

    if (this.timestampExist.length === 1) {
      // this.timestampExist[0].flag_margin_right = '3'
      // this.flagsForm.controls[0]?.get('flag_style')?.setValue(2)
      this.flagsForm.controls[0]?.get('flag_style')?.setValue(1)
      // Seto a mesma cor da flag1 - para facilitar a vida do usuário
      // this.flagsForm.controls[0]?.get('flag_design')?.get('color_hex')?.setValue(this.timestampExist[0].flag_design.color_hex)
      this.convertColor(this.timestampExist[0].flag_design.color_hex)
    }

    this.flagsForm.controls[0]?.get('date_obj')?.patchValue(({
      day_month_year: date,
      day: (dateSplit[2]).split('T').shift(),
      month: dateSplit[1],
      month_s: dateSplit[1] === '01' ? 'JAN' : dateSplit[1] === '02' ? 'FEV' : dateSplit[1] === '03' ? 'MAR' : dateSplit[1] === '04' ? 'ABR' : dateSplit[1] === '05' ? 'MAI' : dateSplit[1] === '06' ? 'JUN' :
        dateSplit[1] === '07' ? 'JUL' : dateSplit[1] === '08' ? 'AGO' : dateSplit[1] === '09' ? 'SET' : dateSplit[1] === '10' ? 'OUT' : dateSplit[1] === '11' ? 'NOV' : dateSplit[1] === '12' ? 'DEZ' : 'JAN',
      month_code: Number(dateSplit[1]),
      year: dateSplit[0].toString(),
      timestamp: newTimestamp,
      // time,
    }), { emitEvent: false })



    // Aqui eu desabilito a cor da dandeira 02
    // A bandeira 02 não pode editar a cor
    this.timeLine.time_line?.flags?.forEach((e: FlagModel) => {
      if (e.date_obj.timestamp === newTimestamp) {
        if (e.flag_id !== this.editFlag?.flag_id) {
          this.disableColor = true
          this.flagsForm.controls[0]?.get('flag_style')?.setValue(2)
        }
      }
    })
    console.log(this.disableColor)
  }



  //================================= 🅰️🅰️ CREATE FLAG 🅰️🅰️ ==============================
  //==============================================================================

  latitudeLongitude() {

    this.latitudeLongitudeService.latitudeLongitude()
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.flagsForm.controls[0]?.get('geolocation')?.patchValue(({
              country_name: res.countryName,
              country_code: res.countryCode,
              state: res.city,
              city: res.locality,
              longitude: res.longitude,
              latitude: res.latitude,
            }))
          }
        },
        error: (err) => {
          this.flagsForm.controls[0]?.get('geolocation')?.patchValue(({
            country_name: 'undefined',
            country_code: 'undefined',
            state: 'undefined',
            city: 'undefined',
            longitude: 0,
            latitude: 0,
          }))
        },
        complete: () => { }
      })
  }



  createFlag() {
    let valClear: any = {}
    if (this.timestampExist.length === 2) {
      return
    }

    if (this.timestampExist.length === 0) {
      this.createEditFlagSubscribe = this.createTimeLineForm.value
    }

    if (this.timestampExist.length === 1) {
      this.timestampExist[0].flags2?.push(this.flagsForm.controls[0].value)
      let flags: FlagModel[] = this.timestampExist
      flags[0].year = this.flagsForm.controls[0].get('year')?.value
      flags[0].flag_margin_right = '3'
      this.createEditFlagSubscribe = { iam_id: '0', time_line: { flags } }
    }


    if (this.createTimeLineForm.invalid) {
      this.matcher = new MyErrorStateMatcher();
      return
    }

    // start-loader
    this.connectingExternalRoutesService.spiderShareLoader({ message: true })

    this.timeLineService.createFlag(this.createEditFlagSubscribe)
      .subscribe({
        next: (res: EncryptDecryptModel) => {
          // let val: any = res.a[0]
          if (res.a === 'OK') {
            this.stateService.updateGetTimeLineHttpSignal(true)
          }
        },
        error: () => {
          this.createEditFlagSubscribe = valClear
          this.stateService.updateTimeLineIndexDbErrorSignalSignal(true)
          // end-loader
          setTimeout(() => {
            this.connectingExternalRoutesService.spiderShareLoader({ message: false })
            this.toastrService.error(this.TOAST['TIME-LINE']['CreateFlagComponent'].error['msn-1']['message-0'], this.TOAST['TIME-LINE']['CreateFlagComponent'].error['msn-1']['message-1']);
          }, 2000)
        },
        complete: () => {
          this.createEditFlagSubscribe = valClear
        }
      })
  }


  // TESTES
  // 1 - Editar bandeira 1 na mesma data
  // 2 - Editar bandeira 2 na mesma data
  // 3 - Aqui separa a flag1 da flag24 - Aqui separa a flag2 da flag1
  // 5 - Editar bandeira 1 'datas diferentes'  se mantendo na posição 01
  // 6 - Editar bandeira 2 'datas diferentes' se mantendo na posição 02
  // 7 - Quando a flag1(não possui flag2) está em uma data A na time - lie e assume a posição 02 em outra data na time line
  // 8 - Quando a flag1(possui flag2) está em uma data A na time - lie e assume a posição 02 em outra data na time line

  /**
  * **************************************** FLAGS POSITIONING TESTS *******************************************************
  * * * * * =================== Get ADD PUT -  ============= * * * * *
  * @param { TEST-1 } Edit_Bandeira_1_On_Same_Date - When flag 1 does not change position
  * @param { TEST-2 } Edit_Bandeira_2_On_Same_Date - When flag 2 does not change position
  * @param { TEST-3 } Separates_Flag1_From_Flag2 - Separates flag1 from flag2
  * @param { TEST-4 } Separates_Flag2_From_Flag1 - Separates flag2 from flag1
  * @param { TEST-5 } Edit_Flag1_Different_Dates_keep_Position_01 - Edit flag 1 'different dates' remaining in position 01
  * @param { TEST-6 } Edit_Flag2_Different_Dates_keep_Position_02 - Editing fleg2 being able to walk on the time line and remaining the position 02
  * @param { TEST-7 } Flag1_mounted_On_Top_Another_Position - When flag1 (does not have flag2) is on date A in the time-lie and assumes position 02 on another date in the time line
  * @param { TEST-8 } Flag1_mounted_On_Top_Another_Position - When flag1 (does have flag2) is on date A in the time-lie and assumes position 02 on another date in the time line
  
  */


  updateFlag() {
    let index: number | undefined
    let indexDelet: number | undefined
    let find: any | undefined
    let find2: any | undefined
    let find3: any | undefined
    let canTenter = false
    this.timeLine.time_line.flags.forEach((e1: FlagModel, i1: number, array1: any) => {

      if (e1.date_obj.timestamp === this.editFlag.date_obj.timestamp) {
        if (this.flagsForm.controls[0]?.get('flag_style')?.value === 1 && this.editFlag.edit === 'edit-flag-1') {
          canTenter = false

          // 🅰️ { TEST-1 } && { TEST-5 } - Here updates flag 1 individually  
          if (this.editFlag.flags2?.length === 0) {
            this.timeLine.time_line.flags[i1] = this.flagsForm.controls[0].value // value coming from the form
            this.timeLine.time_line.flags[i1].flags2 = this.editFlag.flags2

            this.timeLine.time_line.flags[i1].flag_status_update = 'create'
            this.editFlag.flag_status_update = 'delete'
            this.timeLine.time_line.flags.push(this.editFlag)

          }

          // Flag1 -->> Possui Flag2
          if (this.editFlag.flags2?.length === 1) {
            find2 = this.timeLine.time_line.flags?.filter((timestamp: FlagModel) => timestamp.date_obj.timestamp === this.flagsForm.controls[0]?.get('date_obj')?.get('timestamp')?.value);

            // 🃏 Se o find2 tiver flag2 significa que é necessário apenas atualizar a posição da falg1
            if (find2[0] && find2[0].flags2?.length === 1) {
              this.flagsForm.controls[0].get('flag_status_update')?.setValue('update')
              this.timeLine.time_line.flags[i1] = this.flagsForm.controls[0].value // value coming from the form
              this.timeLine.time_line.flags[i1].flags2 = this.editFlag.flags2
            }

            // 🅿️ { TEST-3 } se não tiver flag2 é necessário separa as flags -- todas para a posição 1
            if (!find2[0] && find2?.length === 0) {
              this.flagsForm.controls[0].get('flag_status_update')?.setValue('create')
              this.timeLine.time_line.flags[i1] = this.flagsForm.controls[0].value

              this.editFlag.flags2[0].flag_status_update = 'update'
              this.timeLine.time_line.flags.push(this.editFlag.flags2[0])

            }

          }

        }
      }



      if (e1.flags2?.length === 1) {
        // =================================== 🅿️ FLAG 2 forEach ========================================
        this.timeLine.time_line.flags[i1].flags2?.forEach((e2: FlagModel, i2: number, array2: any) => {

          if (e2.date_obj.timestamp === this.editFlag.date_obj.timestamp) {
            if (this.editFlag.edit === 'edit-flag-2') {

              // 🅰️ { TEST-2 } Here updates flag 2 individually  
              if (this.editFlag.flags2) {
                canTenter = true
                find2 = this.timeLine.time_line.flags?.filter((timestamp: FlagModel) => timestamp.date_obj.timestamp === this.flagsForm.controls[0]?.get('date_obj')?.get('timestamp')?.value);
                index = this.timeLine.time_line.flags?.findIndex((timestamp: FlagModel) => timestamp.date_obj.timestamp === this.flagsForm.controls[0]?.get('date_obj')?.get('timestamp')?.value);
                indexDelet = this.timeLine.time_line.flags?.findIndex((timestamp: FlagModel) => timestamp.date_obj.timestamp === this.editFlag.date_obj.timestamp);
                // { TEST-4 } Here separates flag2 from flag1
                if (find2.length === 0) {
                  this.editFlag.flags2[0] = this.flagsForm.controls[0]?.value
                  this.editFlag.flags2[0].flag_status_update = 'create'
                  this.timeLine.time_line.flags.push(this.editFlag.flags2[0])
                  this.timeLine.time_line.flags[i1].flags2 = []
                  this.timeLine.time_line.flags[indexDelet].flag_status_update = 'update'
                }

                // { TEST-6 } Editing fleg2 being able to walk on the time line and remaining in position 02
                if (find2.length === 1 && this.editFlag.flags2[0]) {

                  // update flag 2 same date
                  if (this.editFlag.flags2[0].date_obj.timestamp === find2[0].date_obj.timestamp) {
                    this.timeLine.time_line.flags[i1].flags2 = [this.flagsForm.controls[0]?.value]
                    this.timeLine.time_line.flags[i1].flag_status_update = 'update'
                  }
                  // flag 2 goes backwards in the time line
                  // It's a repetition even to pass only 01 time in the for loop
                  else if (this.editFlag.flags2[0].date_obj.timestamp < find2[0].date_obj.timestamp) {
                    this.timeLine.time_line.flags[index].flags2 = [this.flagsForm.controls[0]?.value]
                    this.timeLine.time_line.flags[index].flag_status_update = 'update'

                    this.timeLine.time_line.flags[indexDelet].flag_status_update = 'update'
                    this.timeLine.time_line.flags[indexDelet].flags2 = []

                    // flag 2 moves forward on the timeline
                    // It's a repetition even to pass only 01 time in the for loop
                  } else if (this.editFlag.flags2[0].date_obj.timestamp > find2[0].date_obj.timestamp) {
                    this.timeLine.time_line.flags[index].flags2 = [this.flagsForm.controls[0]?.value]
                    this.timeLine.time_line.flags[index].flag_status_update = 'update'

                    this.timeLine.time_line.flags[indexDelet].flag_status_update = 'update'
                    this.timeLine.time_line.flags[indexDelet].flags2 = []
                  }
                }
              }
            }
          }
        })
      }


      // 🎅 flag mounted on top of another taking position
      if (i1 === array1.length - 1 && !canTenter) {
        find3 = this.timeLine.time_line.flags?.filter((timestamp: FlagModel) => timestamp.date_obj.timestamp === this.flagsForm.controls[0]?.get('date_obj')?.get('timestamp')?.value);
        index = this.timeLine.time_line.flags?.findIndex((timestamp: FlagModel) => timestamp.date_obj.timestamp === this.flagsForm.controls[0]?.get('date_obj')?.get('timestamp')?.value);
        indexDelet = this.timeLine.time_line.flags?.findIndex((timestamp: FlagModel) => timestamp.date_obj.timestamp === this.editFlag.date_obj.timestamp);

        if (find3) {

          if (find3.length === 1) {

            // { TEST-7 } When flag1 (does not have flag2) is on date A in the time-lie and assumes position 02 on another date in the time line
            if (this.editFlag && this.editFlag.flags2?.length === 0) {

              // find3 for the upcoming date - I move forward on the time-line - fleg1 assuming position 02
              // When there is 01 flag
              if (find3[0].date_obj.timestamp > this.editFlag.date_obj.timestamp) {
                this.timeLine.time_line.flags[index].flags2 = [this.flagsForm.controls[0]?.value]
                // this.timeLine.time_line.flags.splice(indexDelet, 1);
                this.timeLine.time_line.flags[indexDelet].flag_status_update = 'delete'
                this.timeLine.time_line.flags[index].flag_status_update = 'update'

                // find3 for the upcoming date - I move backwards in the time-line - fleg1 assuming position 02
              } else if (find3[0].date_obj.timestamp < this.editFlag.date_obj.timestamp) {
                this.timeLine.time_line.flags[index].flags2 = [this.flagsForm.controls[0]?.value]
                // this.timeLine.time_line.flags.splice(indexDelet, 1);
                this.timeLine.time_line.flags[indexDelet].flag_status_update = 'delete'
                this.timeLine.time_line.flags[index].flag_status_update = 'update'
              }


              // { TEST-8 } When flag1 (does have flag2) is on date A in the time-lie and assumes position 02 on another date in the time line
            } else if (this.editFlag.flags2 && this.editFlag.flags2?.length >= 1) {
              if (find3[0].date_obj.timestamp > this.editFlag.date_obj.timestamp) {
                this.timeLine.time_line.flags[index].flags2 = [this.flagsForm.controls[0]?.value]
                let flag2: any = this.timeLine.time_line.flags[indexDelet].flags2
                this.timeLine.time_line.flags[indexDelet] = flag2[0]
                this.timeLine.time_line.flags[indexDelet].flag_status_update = 'update'
                this.timeLine.time_line.flags[index].flag_status_update = 'update'

              } else if (find3[0].date_obj.timestamp < this.editFlag.date_obj.timestamp) {
                this.timeLine.time_line.flags[index].flags2 = [this.flagsForm.controls[0]?.value]
                let flag2: any = this.timeLine.time_line.flags[indexDelet].flags2
                this.timeLine.time_line.flags[indexDelet] = flag2[0]
                this.timeLine.time_line.flags[indexDelet].flag_status_update = 'update'
                this.timeLine.time_line.flags[index].flag_status_update = 'update'

              }
            }
          }
        }
      }

    })


    // I need to pass this for to restore the removed years in the pipe | unique
    // I need to pass the for to also correct flag_style and flag_margin_right
    this.timeLine.time_line.flags.forEach((e: FlagModel, i: number) => {
      this.timeLine.iam_id = '0'
      this.timeLine.time_line.flags[i].year = e.date_obj.year

      e.flag_design.color_date = e.flag_design.color_date

      if (e.flags2?.length === 1) {
        e.flag_style = 1
        e.flag_margin_right = '3'
        e.flags2[0].flag_style = 2
        e.flags2[0].flag_margin_right = '0'
        // flag_design
        e.flags2[0].flag_design.color_hex = e.flag_design.color_hex
        e.flags2[0].flag_design.color_rgb = e.flag_design.color_rgb
        e.flags2[0].flag_design.color_hsl = e.flag_design.color_hsl
        // e.flags2[0].flag_design.color_date = e.flag_design.color_date

      }
      if (e.flags2?.length === 0) {
        e.flag_style = 1
        e.flag_margin_right = '0'
      }
    })

    this.timeLine.time_line.flags = this.filterFlagsService.filterOrderFlags(this.timeLine)
    // start-loader
    this.connectingExternalRoutesService.spiderShareLoader({ message: true })
    this.updateSubscribeFlag()
  }





  // filter() {
  //   this.timeLine.time_line.flags.sort((x: FlagModel, y: FlagModel) => {
  //     return x.date_obj.timestamp - y.date_obj.timestamp;
  //   })
  // }



  // Data não é alterada.
  // esse update é quando tem 02 flags na mesa data
  updateSubscribeFlag() {
    this.timeLineService.updateFlag(this.timeLine)
      .subscribe({
        next: (res: EncryptDecryptModel) => {
          // let val: any = res.a[0]
          if (res.a === 'OK') {
            // Atualiza time line
            this.stateService.updateGetTimeLineHttpSignal(true)

            setTimeout(() => {
              // Encontre o flag_id no nível principal
              let find = this.timeLine.time_line.flags?.find((flag: FlagModel) => flag.flag_id === this.flagsForm.controls[0]?.get('flag_id')?.value);

              // Se não encontrar no nível principal, procure em flags2
              if (!find) {
                for (const flag of this.timeLine.time_line.flags) {
                  if (flag.flags2 && flag.flags2.length > 0) {
                    find = flag.flags2.find((subFlag: FlagModel) => subFlag.flag_id === this.flagsForm.controls[0]?.get('flag_id')?.value);
                    if (find) {
                      break; // Encontrei, sair do loop
                    }
                  }
                }
              }

              // Criar o novo objeto de comparação
              let val = {
                oldId: this.editFlag?._id,
                newId: find?._id,
                flag_id: this.editFlag.flag_id
              };

              if (val.newId !== val.oldId) {
                this.updateKanbanObjectId(val) // atualiza ObjectId
                this.updateSpiderTubeObjectId(val)  // atualiza ObjectId
              }

            }, 3000)
          }
        },
        error: () => {
          // this.indexDbGetAllTimeLine('0000')
          this.stateService.updateTimeLineIndexDbErrorSignalSignal(true)
          setTimeout(() => {
            this.connectingExternalRoutesService.spiderShareLoader({ message: false })
            this.toastrService.error(this.TOAST['TIME-LINE']['CreateFlagComponent'].error['msn-2']['message-0'], this.TOAST['TIME-LINE']['CreateFlagComponent'].error['msn-2']['message-1']);
          }, 2000)

        },
        complete: () => {
        }
      })
  }


  indexDbPutAllTimeLine(newTimeLine: TimeLineModel) {
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
          // end-loader
          this.connectingExternalRoutesService.spiderShareLoader({ message: false })
        },
        error: (err) => {
          // end-loader
          this.connectingExternalRoutesService.spiderShareLoader({ message: false })
        },
        complete: () => { }
      })
  }







  //================================= 🅰️🅰️ RADIO BUTTON 🅰️🅰️==============================
  //==============================================================================

  onRadioButtonTextColor(e: MatRadioChange) {
    this.flagsForm.controls[0]?.get('flag_design')?.get('color_text')?.setValue(e.value)
  }

  onRadioButtonNetsColor(e: MatRadioChange) {
    if (e.value === '1') {
      this.flagsForm.controls[0]?.get('flag_design')?.get('color_chips')?.setValue({ background: '74, 74, 74', text: '255, 255, 255' })
    }
    else if (e.value === '2') {
      this.flagsForm.controls[0]?.get('flag_design')?.get('color_chips')?.setValue({ background: '255, 255, 255', text: '74, 74, 74' })
    }
    else if (e.value === '3') {
      this.flagsForm.controls[0]?.get('flag_design')?.get('color_chips')?.setValue({ background: '74, 74, 74', text: '255, 0, 0' })
    }
    else if (e.value === '4') {
      this.flagsForm.controls[0]?.get('flag_design')?.get('color_chips')?.setValue({ background: '255, 0, 0', text: '255, 255, 255' })
    }
    else if (e.value === '5') {
      this.flagsForm.controls[0]?.get('flag_design')?.get('color_chips')?.setValue({ background: '74, 74, 74', text: '255, 255, 0' })
    }
  }

  radioButtonDateColor(e: MatRadioChange) {

    if (e.value === '1') {
      this.flagsForm.controls[0]?.get('flag_design')?.get('color_date')?.setValue(this.flagsForm.controls[0].get('flag_design')?.get('color_rgb')?.value)
    }
    else if (e.value === '2') {
      this.flagsForm.controls[0]?.get('flag_design')?.get('color_date')?.setValue('0, 0, 0') // preto
    }
    else if (e.value === '3') {
      this.flagsForm.controls[0]?.get('flag_design')?.get('color_date')?.setValue('255, 255, 255') // branco
    }
    else if (e.value === '4') {
      this.flagsForm.controls[0]?.get('flag_design')?.get('color_date')?.setValue('255, 0, 0') // vermelho
    }
    else if (e.value === '5') {
      this.flagsForm.controls[0]?.get('flag_design')?.get('color_date')?.setValue('255, 255, 0') // amarelo
    }

  }

  onRadioButtonTransparencyColor(e: MatRadioChange) {
    this.flagsForm.controls[0]?.get('flag_design')?.get('color_transparency')?.setValue(e.value)
  }


  //================================= 🅰️🅰️ CONVERT COLORS 🅰️🅰️ ==============================
  //==============================================================================
  //⬇️ Convert Color
  convertColor(val?: string, val2?: string) {
    let flags = this.createTimeLineForm.get('time_line')?.get('flags') as FormArray

    if (val) {
      let colorFormats = this.convertColorService.convertColor(val)
      flags.at(0)?.get('flag_design')?.get('color_hex')?.setValue(colorFormats.hex)
      flags.at(0)?.get('flag_design')?.get('color_rgb')?.setValue(colorFormats.rgb)
      flags.at(0)?.get('flag_design')?.get('color_date')?.setValue(colorFormats.rgb)
      flags.at(0)?.get('flag_design')?.get('color_hsl')?.setValue(colorFormats.hsl)

      // Toda vez que a data for alterada ou a cor da bandeira 02, o fundo da data será resetado para ficar igual ao da bandeira 01.
      if (this.editFlagFormInput && this.editFlagFormInput.flags2 && this.editFlagFormInput.flags2?.length > 0) {
        // this.editFlagFormInput.flags2[0].flag_design.color_date = colorFormats.rgb
      }
    }
    this.colorHexaVal = flags.at(0)?.get('flag_design')?.get('color_hex')?.value
  }

  canNotConvertColor() {
    // this.toastrService.warning('Devem possuir a mesma cor', 'Bandeira  01 e 02');
    this.toastrService.warning(this.TOAST['TIME-LINE']['CreateFlagComponent'].warning['msn-1']['message-0'], this.TOAST['TIME-LINE']['CreateFlagComponent'].warning['msn-1']['message-1']);

  }

  clearForm() {
    this.openColorCreat.activeFilter = '0' // usado para abrir o color pick creat
    this.stateService.updateActiveFilterSignal(this.openColorCreat)
  }


  addDataMask(event: any) {
    this.addDataMaskVal = event.target.value;
  }


  updateKanbanObjectId(val: any) {

    this.timeLineService.updateKanbanObjectId(val)
      .subscribe({
        next: () => { },
        error: (err) => {

        },
        complete: () => {
        }
      })
  }

  updateSpiderTubeObjectId(val: any) {

    this.timeLineService.updateSpiderTubeObjectId(val)
      .subscribe({
        next: () => { },
        error: (err) => {

        },
        complete: () => {
        }
      })



  }

}
