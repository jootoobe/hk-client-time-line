import { style } from '@angular/animations';
import { DatePipe } from "@angular/common";
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
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

@Component({
  selector: 'create-flag', // remove word app- from microservices
  templateUrl: './create-flag.component.html',
  styleUrls: ['./create-flag.component.scss',]
})

export class CreateFlagComponent implements OnInit, AfterViewInit {

  @Input({ required: true }) timeLine!: TimeLineModel
  @Input({ required: true }) editFlagForm!: FlagModel
  @Input({ required: true }) flagCreateEdit!: string

  timeLineForEdit!: TimeLineModel;
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


  // RADIO BUTTON
  radioRedeTextColor = '0,0,0' // text colors
  radioRedeNets = '1' // {background: '74,74,74', text: '255,255,255'}
  radioButtonDate = '144,171,64' // cor fundo data com transparencia de 0.3
  radioRedeTransparency = '0.1' // transparência bandeira

  addDataMaskVal = ''

  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private convertColorService: ConvertColorService,
    private datePipe: DatePipe,
    private latitudeLongitudeService: LatitudeLongitudeService,
    private toastrService: ToastrService,
    private timeLineService: TimeLineService,
    private indexDbTimeLineService: IndexDbTimeLineService,
  ) {

    this.buildForm()

    this.stateService.getAllTimeLineSubject$
      .subscribe({
        next: (res: TimeLineModel) => {
          if (res && res.time_line) {
            // this.timeLine = res
          }
        },
        error: () => { },
        complete: () => { }
      })

  }


  ngOnChanges(changes: SimpleChanges) {

    // Editing flag
    if (changes['editFlagForm']?.currentValue.flag_id) {
      this.editFlag = changes['editFlagForm']?.currentValue
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
          background: new FormControl<string | null>('74,74,74', [Validators.required]),
          text: new FormControl<string | null>('255,255,255', [Validators.required]),
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


  updateFlagobject(flagVal: FlagModel) {
    let currentlyDate = this.datePipe.transform(new Date(), 'medium'); // Date.parse(newDate);    

    if (flagVal.edit === 'edit-flag-1') {
      this.flagsForm.controls[0].patchValue(flagVal)
    }

    if (flagVal.edit === 'edit-flag-2') {
      let newVal: any = flagVal.flags2
      this.flagsForm.controls[0].patchValue(newVal[0])
    }

    this.flagsForm.controls[0]?.get('flag_update_at')?.setValue(currentlyDate)

    // o pipe | unique remove o ano
    this.flagsForm.controls[0]?.get('year')?.setValue(this.flagsForm.controls[0]?.get('date_obj')?.get('year')?.value)

    //tem que fazer isso para não dar um problema com o matDatepicker
    this.flagsForm.controls[0]?.get('date_obj')?.get('date_origin')?.setValue(new Date(flagVal.date_obj.date_origin))

  }

  // ⬇️ Get Flag form
  get flagsForm() {
    return this.createTimeLineForm.get('time_line')?.get('flags') as FormArray
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
            this.toastrService.error('É obrigatório', 'Horário');
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
    let date: string = `${datePicker.split('T').shift()}T${this.time}${datePicker.substring(19)}`
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
        // if (this.flagsForm.controls[0]?.get('flag_style')?.value === 1 && this.editFlag.edit === 'edit-flag-1') {
        //   canTenter = false

        //   // 🅰️ { TEST-1 } - Here updates flag 1 individually  
        //   //  { TEST-5 } Edit_Flag1_Different_Sates
        //   if (this.editFlag.flags2) {
        //     canTenter = true
        //     this.timeLine.time_line.flags[i1] = this.flagsForm.controls[0].value // valor vindo do formulário 
        //     this.timeLine.time_line.flags[i1].flags2 = this.editFlag.flags2 // valor vindo do botão de edição

        //     find = this.timeLine.time_line.flags?.filter((timestamp: FlagModel) => timestamp.date_obj.timestamp === this.editFlag.date_obj.timestamp);

        //     // { TEST-3 } Here separates flag1 from flag2
        //     if (find.length === 0) {
        //       if (this.editFlag.flags2[0]) {
        //         this.timeLine.time_line.flags.push(this.editFlag.flags2[0])
        //         this.timeLine.time_line.flags[i1].flags2 = []
        //       }
        //     }
        //   }
        // }

        find = this.timeLine.time_line.flags?.filter((timestamp: FlagModel) => timestamp.date_obj.timestamp === this.editFlag.date_obj.timestamp);
        find2 = this.timeLine.time_line.flags?.filter((timestamp: FlagModel) => timestamp.date_obj.timestamp === this.flagsForm.controls[0]?.get('date_obj')?.get('timestamp')?.value);
        index = this.timeLine.time_line.flags?.findIndex((timestamp: FlagModel) => timestamp.date_obj.timestamp === this.flagsForm.controls[0]?.get('date_obj')?.get('timestamp')?.value);
        indexDelet = this.timeLine.time_line.flags?.findIndex((timestamp: FlagModel) => timestamp.date_obj.timestamp === this.editFlag.date_obj.timestamp);
        console.log('1111111', find)
        console.log('2222222', find2)
        console.log('333333', index)
        console.log('44444', indexDelet)

        if (this.editFlag.flags2?.length === 0) {

          if (find2.length === 0) { // flag 1 quando não existe data 
            this.timeLine.time_line.flags[indexDelet].flag_status_update = 'delete'
            this.flagsForm.controls[0].get('flag_status_update')?.setValue('create')
            this.timeLine.time_line.flags.push(this.flagsForm.controls[0].value) // valor vindo do formulário 
            console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', find2)
            console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', find)

          } else if (find2.length === 1) { // flag 1 na mesma data
            this.flagsForm.controls[0].get('flag_status_update')?.setValue('update')
            this.timeLine.time_line.flags[i1] = this.flagsForm.controls[0].value // valor vindo do formulário 
            console.log('AAAAAAAAAAAAAAAAAAAAAA !!!!!!!!!!!!', find2)
            console.log('AAAAAAAAAAAAAAAAAAAAAAAA !!!!!!!!!!!!!!!!!', find)
          }

          // Flag 1 seprando da flag2 - 
          // Ambas assumem a posição flag1 sem flag2
        } else if (this.editFlag.flags2?.length === 1) {

          if (find2 && this.editFlag.edit === 'edit-flag-1') {
            this.flagsForm.controls[0].get('flag_status_update')?.setValue('update')
            this.timeLine.time_line.flags[i1] =  this.flagsForm.controls[0].value
            this.timeLine.time_line.flags[i1].flags2 = this.editFlag.flags2
            console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqq', find)
          
          } else if (!find2 && this.editFlag.edit === 'edit-flag-1') {
            this.editFlag.flags2[0].flag_status_update = 'update'
            this.timeLine.time_line.flags[indexDelet] = this.editFlag.flags2[0]
            this.flagsForm.controls[0].get('flag_status_update')?.setValue('update')
            this.timeLine.time_line.flags.push(this.flagsForm.controls[0].value)
            console.log('ÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇÇ', find)
          }

        }
      }


      // =================================== 🅿️ FLAG 2 forEach ========================================
      if (e1.flags2?.length === 1) {
        this.timeLine.time_line.flags[i1].flags2?.forEach((e2: FlagModel, i2: number, array2: any) => {

          if (e2.date_obj.timestamp === this.editFlag.date_obj.timestamp) {
            if (this.editFlag.edit === 'edit-flag-2') {

              // 🅰️ { TEST-2 } Here updates flag 2 individually  
              if (this.editFlag.flags2) {
                canTenter = true
                find2 = this.timeLine.time_line.flags?.filter((timestamp: FlagModel) => timestamp.date_obj.timestamp === this.flagsForm.controls[0]?.get('date_obj')?.get('timestamp')?.value);
                index = this.timeLine.time_line.flags?.findIndex((timestamp: FlagModel) => timestamp.date_obj.timestamp === this.flagsForm.controls[0]?.get('date_obj')?.get('timestamp')?.value);
                indexDelet = this.timeLine.time_line.flags?.findIndex((timestamp: FlagModel) => timestamp.date_obj.timestamp === this.editFlag.date_obj.timestamp);
                console.log('1111111111111111111111111111111111111111')

                // { TEST-4 } Here separates flag2 from flag1
                if (find2.length === 0) {
                  this.editFlag.flags2[0] = this.flagsForm.controls[0]?.value
                  this.timeLine.time_line.flags.push(this.editFlag.flags2[0])
                  this.timeLine.time_line.flags[i1].flags2 = []
                  console.log('2222222222222222222222222222222222')

                }

                // { TEST-6 } Editing fleg2 being able to walk on the time line and remaining in position 02
                if (find2.length === 1 && this.editFlag.flags2[0]) {
                  // flag 2 goes backwards in the time line
                  // It's a repetition even to pass only 01 time in the for loop
                  if (this.editFlag.flags2[0].date_obj.timestamp < find2[0].date_obj.timestamp) {
                    this.timeLine.time_line.flags[index].flags2 = [this.flagsForm.controls[0]?.value]
                    this.timeLine.time_line.flags[indexDelet].flags2 = []
                    console.log('33333333333333333333333333333333')

                    // flag 2 moves forward on the timeline
                    // It's a repetition even to pass only 01 time in the for loop
                  } else if (this.editFlag.flags2[0].date_obj.timestamp > find2[0].date_obj.timestamp) {
                    this.timeLine.time_line.flags[index].flags2 = [this.flagsForm.controls[0]?.value]
                    this.timeLine.time_line.flags[indexDelet].flags2 = []
                    console.log('44444444444444444444444444444444444')

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
                this.timeLine.time_line.flags.splice(indexDelet, 1);
                console.log('555555555555555555555555555')

                // find3 for the upcoming date - I move backwards in the time-line - fleg1 assuming position 02
              } else if (find3[0].date_obj.timestamp < this.editFlag.date_obj.timestamp) {
                this.timeLine.time_line.flags[index].flags2 = [this.flagsForm.controls[0]?.value]
                this.timeLine.time_line.flags.splice(indexDelet, 1);
                console.log('6666666666666666666666666666')
              }


              // { TEST-8 } When flag1 (does have flag2) is on date A in the time-lie and assumes position 02 on another date in the time line
            } else if (this.editFlag.flags2 && this.editFlag.flags2?.length >= 1) {
              if (find3[0].date_obj.timestamp > this.editFlag.date_obj.timestamp) {
                this.timeLine.time_line.flags[index].flags2 = [this.flagsForm.controls[0]?.value]
                let flag2: any = this.timeLine.time_line.flags[indexDelet].flags2
                this.timeLine.time_line.flags[indexDelet] = flag2[0]
                console.log('77777777777777777777777777777777')

              } else if (find3[0].date_obj.timestamp < this.editFlag.date_obj.timestamp) {
                this.timeLine.time_line.flags[index].flags2 = [this.flagsForm.controls[0]?.value]
                let flag2: any = this.timeLine.time_line.flags[indexDelet].flags2
                this.timeLine.time_line.flags[indexDelet] = flag2[0]
                console.log('888888888888888888888888888888888888')
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

    this.filter()
    console.log(this.timeLine)
    // this.updateSubscribeFlag()
  }


  filter() {
    this.timeLine.time_line.flags.sort((x: FlagModel, y: FlagModel) => {
      return x.date_obj.timestamp - y.date_obj.timestamp;
    })
  }



  // Data não é alterada.
  // esse update é quando tem 02 flags na mesa data
  updateSubscribeFlag() {
    console.log('updateFlag updateFlag', this.createEditFlagSubscribe)
    this.timeLineService.updateFlag(this.timeLine)
      .subscribe({
        next: (res: EncryptModel) => {
          // let val: any = res.a[0]
          if (res.a === 'OK') {
            this.getAllTimeLineById()
          }
        },
        error: () => {
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
        },
        error: (err) => { },
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
      this.flagsForm.controls[0]?.get('flag_design')?.get('color_chips')?.setValue({ background: '74,74,74', text: '255,255,255' })
    }
    else if (e.value === '2') {
      this.flagsForm.controls[0]?.get('flag_design')?.get('color_chips')?.setValue({ background: '255,255,255', text: '74,74,74' })
    }
    else if (e.value === '3') {
      this.flagsForm.controls[0]?.get('flag_design')?.get('color_chips')?.setValue({ background: '74,74,74', text: '255,0,0' })
    }
    else if (e.value === '4') {
      this.flagsForm.controls[0]?.get('flag_design')?.get('color_chips')?.setValue({ background: '255,0,0', text: '255,255,255' })
    }
    else if (e.value === '5') {
      this.flagsForm.controls[0]?.get('flag_design')?.get('color_chips')?.setValue({ background: '74,74,74', text: '255,255,0' })
    }
  }

  radioButtonDateColor(e: MatRadioChange) {
    this.flagsForm.controls[0]?.get('flag_design')?.get('color_date')?.setValue(e.value)

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
