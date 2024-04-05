import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatRadioChange } from "@angular/material/radio";
import { debounceTime, distinctUntilChanged, take, tap } from "rxjs";

import { MatDatepickerTimeHeaderComponent } from "../../../../../components/datepicker-time/mat-datepicker-time-header.component";
import { ConvertColorService } from "../../../../../shared/services/convert-color.service";
import { StateService } from "../../../../../shared/services/state.service";
import { MyErrorStateMatcher } from "../../../../../shared/validators/err/invalid-control";
import { TolltipCreateHelper } from "./tolltip-create-helper";
import { DateObjModel } from "../../../../../models/date-obj.model";
import { DatePipe } from "@angular/common";
import { LatitudeLongitudeService } from "../../../../../shared/services/latitude-longitude.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'create-flag', // remove word app- from microservices
  templateUrl: './create-flag.component.html',
  styleUrls: ['./create-flag.component.scss',]
})

export class CreateFlagComponent implements OnInit, AfterViewInit {
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
  radioRedeTransparency = '0.2' // transparência bandeira
  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private convertColorService: ConvertColorService,
    private datePipe: DatePipe,
    private latitudeLongitudeService: LatitudeLongitudeService,
    private toastrService: ToastrService,
  ) {

    this.buildForm()
  }


  ngOnInit(): void {
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
      iam_id: new FormControl<string | null>(null, []),
      time_line: this.fb.group({
        flags: new FormArray([this.createFlagobject()])
      })
    });


  }

  createFlagobject(): FormGroup {
    return this.fb.group({
      year: new FormControl<string | null>(null + this.stateService.getUniqueId(5), [Validators.required, Validators.minLength(32), Validators.maxLength(35)]),
      flag_id: new FormControl<string | null>('flag_id_' + this.stateService.getUniqueId(5), [Validators.required, Validators.minLength(32), Validators.maxLength(35)]),
      flag_title: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      flag_description: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(500)]),
      flag_style: new FormControl<any | null>(null, [Validators.required]),
      flag_style2: new FormControl<any | null>(null, []),
      flag_local_zone: new FormControl<string | null>(null, []),
      flag_created_at: new FormControl<string | null>(null, []),
      flag_update_at: new FormControl<string | null>('0', []),
      flag_margin_right: new FormControl<string | null>('0', []),

      flag_design: this.fb.group({
        color_text: new FormControl<string | null>('0, 0, 0', [Validators.required]),
        color_transparency: new FormControl<string | null>('0.3', [Validators.required]),
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
    });

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

  timestampDate(flag?: string) {

    let datePicker: any = this.flagsForm.controls[0]?.get('date_obj')?.get('date_origin')?.value
    console.log(datePicker)
    console.log('wwwwwww', this.time)


    if (datePicker) {
      datePicker = datePicker.toISOString() // convert to timestemp
      let date: string = `${datePicker.split('T').shift()}T${this.time}${datePicker.substring(19)}`
      this.flagsForm.controls[0]?.get('year')?.setValue(datePicker.split('-')[0])

      let dateSplit = datePicker.split('-')
      let newTimestamp = Date.parse(date.toString())

      this.flagsForm.controls[0]?.get('date_obj')?.patchValue(({
        day_month_year: date,
        day: (dateSplit[2]).split('T').shift(),
        month: dateSplit[1],
        month_s: dateSplit[1] === '01' ? 'JAN' : dateSplit[1] === '02' ? 'FEV' : dateSplit[1] === '03' ? 'MAR' : dateSplit[1] === '04' ? 'ABR' : dateSplit[1] === '05' ? 'MAI' : dateSplit[1] === '06' ? 'JUN' :
          dateSplit[1] === '07' ? 'JUL' : dateSplit[1] === '08' ? 'AGO' : dateSplit[1] === '09' ? 'SET' : dateSplit[1] === '10' ? 'OUT' : dateSplit[1] === '11' ? 'NOV' : dateSplit[1] === '12' ? 'DEZ' : 'JAN',
        month_code: Number(dateSplit[1]),
        year: dateSplit[0],
        timestamp: newTimestamp,
        // time,
      }), { emitEvent: false })

    }

  }



  //================================= 🅰️🅰️ CREATE FLAG 🅰️🅰️ ==============================
  //==============================================================================

  latitudeLongitude() {
    if (this.createTimeLineForm.invalid) {
      this.matcher = new MyErrorStateMatcher();
      return
    }

    this.vrifyTimestapnFlag()

    this.latitudeLongitudeService.latitudeLongitude()
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.flagsForm.controls[0]?.get('geolocation')?.patchValue(({
              country_name: res.countryName,
              country_code: res.country_code,
              state: res.city,
              city: res.locality,
              longitude: res.longitude,
              latitude: res.latitude,
            }))

            this.createFlag()
          }
        },
        error: (err) => {
          this.createFlag()
        },
        complete: () => {

        }
      })
  }

  vrifyTimestapnFlag() {
    let currentlyDate = this.datePipe.transform(new Date(), 'medium'); // Date.parse(newDate);
    // if (this.flagEdit === 'create') {
    //   this.flagsForm['controls'][0]?.get('flag_created_at')?.setValue(currentlyDate)

    // } else if (this.flagEdit === 'edit_flag1' || this.flagEdit === 'edit_flag2') {
    //   this.flagsForm['controls'][0]?.get('flag_update_at')?.setValue(currentlyDate)
    // }
    // I need this filter to add the flag in the same year
    // let yearFlag = this.flags.filter((yearFlag: any) => yearFlag.year === this.createTimeLineForm.get('year')?.value);
  }

  createFlag() {
    if (this.createTimeLineForm.invalid) {
      this.matcher = new MyErrorStateMatcher();
      return
    }

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
    console.log('ssssssss', flags)
    let colorFormats = this.convertColorService.convertColor(flags.at(0)?.get('flag_design')?.get('color_hex')?.value)
    flags.at(0)?.get('flag_design')?.get('color_hex')?.setValue(colorFormats.hex)
    flags.at(0)?.get('flag_design')?.get('color_rgb')?.setValue(colorFormats.rgb)
    flags.at(0)?.get('flag_design')?.get('color_hsl')?.setValue(colorFormats.hsl)

  }




}
