import { style } from '@angular/animations';
import { DatePipe } from "@angular/common";
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, effect } from "@angular/core";
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
import { EncryptModel } from "../../../../../../../../hk-pro-client-spidershare/src/app/models/cryptos/subscriptions/encrypt.model";
import { IndexDbTimeLineService } from "../../../../../shared/services/storage/indexed-db-timeline-store.service";
import { ConnectingExternalRoutesService } from '../../../../../shared/services/connecting-external-routes/connecting-external-routes.service';
import { FilterFlagsService } from '../../../../../shared/services/filter-flags.service';

@Component({
  selector: 'create-flag', // remove word app- from microservices
  templateUrl: './create-flag.component.html',
  styleUrls: ['./create-flag.component.scss',]
})

export class CreateFlagComponent implements OnChanges, OnInit, AfterViewInit {

  @Input({ required: true }) timeLine!: TimeLineModel
  @Input({ required: true }) editFlagFormInput!: FlagModel
  @Input({ required: true }) flagCreateEditInput!: string

  editFlag!: FlagModel;
  timestampExist!: FlagModel[];
  createEditFlagSubscribe!: TimeLineModel

  createTimeLineForm!: FormGroup
  matcher!: MyErrorStateMatcher // form validator errors

  disableColor = false

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

  addDataMaskVal = ''
  chipsArray!: FormArray | any
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
  ) {

    effect(() => {
      this.TOAST = this.stateService.toastSignalComputed()
    })

    this.chipsArray = []
    this.buildForm()

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
    setTimeout(() => { // aqui precisa de setTimeout para espear o tradutor carregar adequadamente
      this.help1 = this.tolltipCreateHelper.help1()
      this.help2 = this.tolltipCreateHelper.help2()
      this.help3 = this.tolltipCreateHelper.help3()
      this.help4 = this.tolltipCreateHelper.help4()
      this.help5 = this.tolltipCreateHelper.help5()
      this.help6 = this.tolltipCreateHelper.help6()
    }, 500)

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
      flag_id: new FormControl<string | null>('flag_id_' + this.stateService.getUniqueId(5), [Validators.required, Validators.minLength(32), Validators.maxLength(35)]),
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

    let currentlyDate = this.datePipe.transform(new Date(), 'medium'); // Date.parse(newDate);    

    if (flagVal.edit === 'edit-flag-1') {
      this.flagsForm.controls[0].patchValue(flagVal)

      if (this.editFlag && this.editFlag.social_medias_chips.length > 0) {
        this.chipsArray = (<FormArray>this.flagsForm.controls[0].get('social_medias_chips'))

        this.editFlag.social_medias_chips.forEach((e: any) => {
          this.chipsArray.push(new FormControl({ name: e.name }));
        })
      }
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

    if (val2 === this.flagsForm.controls[0]?.get('flag_design')?.get('color_rgb')?.value ) {  //   <!-- Mesma cor bandeira -->
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

    console.log('sssssssssss', this.radioButtonDate)
    this.radioRedeTransparency = this.flagsForm.controls[0]?.get('flag_design')?.get('color_transparency')?.value
  }



  //================================= 🅰️🅰️ TIME STEMP 🅰️🅰️ ==============================
  //==============================================================================

  toggleDatePicker(ref: any) {  // console.log('++++++++++++++++==', ref._opened)

  }

  setDateTimestamp() {
    // GET DATE
    this.flagsForm.controls[0]?.get('date_obj')?.get('date_origin')?.valueChanges
      .pipe(
        debounceTime(800), // digitação dentro do intervalo, ele espera pra fazer a busca
        distinctUntilChanged(),// Se eu digitar uma query - ele vai permitir apenas as msn que são diferentes umas das outras
      ).subscribe({
        next: () => {
          console.log(this.time.length)
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
          console.log(time.length)
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
    this.timestampExist = []
    let datePicker: any = ''
    datePicker = this.flagsForm.controls[0]?.get('date_obj')?.get('date_origin')?.value

    datePicker = datePicker.toISOString() // convert to timestemp
    let date: string = `${datePicker.split('T').shift()}T${this.time}${datePicker?.substring(19)}`
    this.flagsForm.controls[0]?.get('year')?.setValue(datePicker.split('-')[0])

    let dateSplit = datePicker.split('-')
    let newTimestamp = Date.parse(date.toString())
    console.log(newTimestamp)

    // Check if there are 01 or 02 identical timestamps
    if (this.timeLine && this.timeLine?.time_line) { // quando não existem bandeiras
      for (let flag of this.timeLine?.time_line?.flags) {
        if (flag.date_obj.timestamp === newTimestamp) {
          console.log('vvvvvvvvvvvvvvvvvvvvvvvvv', flag)
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

      this.toastrService.warning('Até 02 flags por data e horário', 'Máximo 02 flags');
      return
    }

    if (this.timestampExist.length === 0) {
      this.flagsForm.controls[0]?.get('flag_style')?.setValue(1)
    }

    if (this.timestampExist.length === 1) {
      // this.timestampExist[0].flag_margin_right = '3'
      this.flagsForm.controls[0]?.get('flag_style')?.setValue(2)

      // Seto a mesma cor da flag1 - para facilitar a vida do usuário
      this.flagsForm.controls[0]?.get('flag_design')?.get('color_hex')?.setValue(this.timestampExist[0].flag_design.color_hex)
      this.convertColor()
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

    console.log('sssssssssssssss>>>>>>>>>>>.', this.createEditFlagSubscribe)
    this.timeLineService.createFlag(this.createEditFlagSubscribe)
      .subscribe({
        next: (res: EncryptModel) => {
          // let val: any = res.a[0]
          if (res.a === 'OK') {
            this.getAllTimeLineById()
          }
        },
        error: () => {
          this.createEditFlagSubscribe = valClear
          this.indexDbGetAllTimeLine('0000')
          // end-loader
          this.connectingExternalRoutesService.spiderShareLoader({ message: false })
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

            console.log('EU OU OQUE ????? --- SOU ---- 0000000000000000000000000')
          }

          // Flag1 -->> Possui Flag2
          if (this.editFlag.flags2?.length === 1) {
            find2 = this.timeLine.time_line.flags?.filter((timestamp: FlagModel) => timestamp.date_obj.timestamp === this.flagsForm.controls[0]?.get('date_obj')?.get('timestamp')?.value);
            console.log('ssssssssssssssssss', find2[0])

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

              console.log('EU OU OQUE ????? --- SOU SEPAROOOO---- 22222222222222', find2)
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
                console.log('444444444444444444444444')
                // { TEST-4 } Here separates flag2 from flag1
                if (find2.length === 0) {
                  this.editFlag.flags2[0] = this.flagsForm.controls[0]?.value
                  this.editFlag.flags2[0].flag_status_update = 'create'
                  this.timeLine.time_line.flags.push(this.editFlag.flags2[0])
                  this.timeLine.time_line.flags[i1].flags2 = []
                  this.timeLine.time_line.flags[indexDelet].flag_status_update = 'update'
                  console.log('555555555555555555')
                }

                // { TEST-6 } Editing fleg2 being able to walk on the time line and remaining in position 02
                if (find2.length === 1 && this.editFlag.flags2[0]) {

                  // update flag 2 same date
                  if (this.editFlag.flags2[0].date_obj.timestamp === find2[0].date_obj.timestamp) {
                    this.timeLine.time_line.flags[i1].flags2 = [this.flagsForm.controls[0]?.value]
                    this.timeLine.time_line.flags[i1].flag_status_update = 'update'
                    console.log('666666666666666666666')
                  }
                  // flag 2 goes backwards in the time line
                  // It's a repetition even to pass only 01 time in the for loop
                  else if (this.editFlag.flags2[0].date_obj.timestamp < find2[0].date_obj.timestamp) {
                    this.timeLine.time_line.flags[index].flags2 = [this.flagsForm.controls[0]?.value]
                    this.timeLine.time_line.flags[index].flag_status_update = 'update'

                    this.timeLine.time_line.flags[indexDelet].flag_status_update = 'update'
                    this.timeLine.time_line.flags[indexDelet].flags2 = []
                    console.log('77777777777777777')

                    // flag 2 moves forward on the timeline
                    // It's a repetition even to pass only 01 time in the for loop
                  } else if (this.editFlag.flags2[0].date_obj.timestamp > find2[0].date_obj.timestamp) {
                    this.timeLine.time_line.flags[index].flags2 = [this.flagsForm.controls[0]?.value]
                    this.timeLine.time_line.flags[index].flag_status_update = 'update'

                    this.timeLine.time_line.flags[indexDelet].flag_status_update = 'update'
                    this.timeLine.time_line.flags[indexDelet].flags2 = []
                    console.log('888888888888888888888')
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
                console.log('9999999999999999999')

                // find3 for the upcoming date - I move backwards in the time-line - fleg1 assuming position 02
              } else if (find3[0].date_obj.timestamp < this.editFlag.date_obj.timestamp) {
                this.timeLine.time_line.flags[index].flags2 = [this.flagsForm.controls[0]?.value]
                // this.timeLine.time_line.flags.splice(indexDelet, 1);
                this.timeLine.time_line.flags[indexDelet].flag_status_update = 'delete'
                this.timeLine.time_line.flags[index].flag_status_update = 'update'
                console.log('100000000000000000000')
              }


              // { TEST-8 } When flag1 (does have flag2) is on date A in the time-lie and assumes position 02 on another date in the time line
            } else if (this.editFlag.flags2 && this.editFlag.flags2?.length >= 1) {
              if (find3[0].date_obj.timestamp > this.editFlag.date_obj.timestamp) {
                this.timeLine.time_line.flags[index].flags2 = [this.flagsForm.controls[0]?.value]
                let flag2: any = this.timeLine.time_line.flags[indexDelet].flags2
                this.timeLine.time_line.flags[indexDelet] = flag2[0]
                this.timeLine.time_line.flags[indexDelet].flag_status_update = 'update'
                this.timeLine.time_line.flags[index].flag_status_update = 'update'
                console.log('11-11-11-11-11-11-11-11-11-11')

              } else if (find3[0].date_obj.timestamp < this.editFlag.date_obj.timestamp) {
                this.timeLine.time_line.flags[index].flags2 = [this.flagsForm.controls[0]?.value]
                let flag2: any = this.timeLine.time_line.flags[indexDelet].flags2
                this.timeLine.time_line.flags[indexDelet] = flag2[0]
                this.timeLine.time_line.flags[indexDelet].flag_status_update = 'update'
                this.timeLine.time_line.flags[index].flag_status_update = 'update'
                console.log('12-12-12-12-12-12-12-12-12-12-12-12')

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
      if (e.flags2?.length === 1) {
        e.flag_style = 1
        e.flag_margin_right = '3'
        e.flags2[0].flag_style = 2
        e.flags2[0].flag_margin_right = '0'
      }
      if (e.flags2?.length === 0) {
        e.flag_style = 1
        e.flag_margin_right = '0'
      }
    })

    this.timeLine.time_line.flags = this.filterFlagsService.filterOrderFlags(this.timeLine)
    console.log('pppppppppppppppppppppp', this.timeLine)
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
    console.log('updateFlag updateFlag', this.timeLine)
    this.timeLineService.updateFlag(this.timeLine)
      .subscribe({
        next: (res: EncryptModel) => {
          // let val: any = res.a[0]
          if (res.a === 'OK') {
            this.getAllTimeLineById()
          }
        },
        error: () => {
          this.indexDbGetAllTimeLine('0000')
        },
        complete: () => {
        }
      })
  }

  // Remover depois
  getAllTimeLineById() {
    this.timeLineService.getAllTimeLineById()
      .subscribe({
        next: (res: any) => {
          let newTimeLine = {
            time_line: {
              flags: res.flags
            }
          }
          this.stateService.updateGetAllTimeLine(newTimeLine)
          this.indexDbPutAllTimeLine(newTimeLine)
        },
        error: () => {
          // end-loader
          this.connectingExternalRoutesService.spiderShareLoader({ message: false })
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
        next: (res: string) => {
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


  indexDbGetAllTimeLine(yearKey: string) {
    const connTimeLine$ = this.indexDbTimeLineService.connectToIDBTimeLine();
    connTimeLine$.pipe(
      switchMap(() =>
        this.indexDbTimeLineService.indexDbGetAllTimeLine('time_line', yearKey)
      ))
      .subscribe({
        next: (res: TimeLineModel) => {
          console.log('this.indexDbGetAllTimeLine', res)
          let valFlags: FlagModel[] = res.time_line.flags
          let newTimeLine = {
            time_line: {
              flags: valFlags
            }
          }
          this.stateService.updateGetAllTimeLine(newTimeLine)
          // end-loader
          this.connectingExternalRoutesService.spiderShareLoader({ message: false })
        },
        error: (err) => {
          // end-loader
          this.connectingExternalRoutesService.spiderShareLoader({ message: false })
        },
        complete: () => {
        }
      })
  }




  //================================= 🅰️🅰️ RADIO BUTTON 🅰️🅰️==============================
  //==============================================================================

  onRadioButtonTextColor(e: MatRadioChange) {
    this.flagsForm.controls[0]?.get('flag_design')?.get('color_text')?.setValue(e.value)
  }

  onRadioButtonNetsColor(e: MatRadioChange) {
    console.log('eeeeeeeeeeeeeeeeee', e)
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
  convertColor() {
    // this.createTimeLineForm.value.flags[0]['color_hex']
    let flags = this.createTimeLineForm.get('time_line')?.get('flags') as FormArray
    let colorFormats = this.convertColorService.convertColor(flags.at(0)?.get('flag_design')?.get('color_hex')?.value)
    flags.at(0)?.get('flag_design')?.get('color_hex')?.setValue(colorFormats.hex)
    flags.at(0)?.get('flag_design')?.get('color_rgb')?.setValue(colorFormats.rgb)
    flags.at(0)?.get('flag_design')?.get('color_date')?.setValue(colorFormats.rgb)
    flags.at(0)?.get('flag_design')?.get('color_hsl')?.setValue(colorFormats.hsl)

  }


  clearForm() {
    // this.editFlagForm = {}
  }


  addDataMask(event: any) {
    this.addDataMaskVal = event.target.value;
  }

}
