import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatRadioChange } from "@angular/material/radio";
import { debounceTime, distinctUntilChanged, tap } from "rxjs";

import { MatDatepickerTimeHeaderComponent } from "../../../../../components/datepicker-time/mat-datepicker-time-header.component";
import { ConvertColorService } from "../../../../../shared/services/convert-color.service";
import { StateService } from "../../../../../shared/services/state.service";
import { MyErrorStateMatcher } from "../../../../../shared/validators/err/invalid-control";
import { TolltipCreateHelper } from "./tolltip-create-helper";
import { DateObjModel } from "../../../../../models/date-obj.model";
import { DatePipe } from "@angular/common";
import { LatitudeLongitudeService } from "../../../../../shared/services/latitude-longitude.service";

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
  ) {

    this.buildForm()
  }


  ngOnInit(): void { }

  ngAfterViewInit(): void {
    setTimeout(() => { // aqui precisa de setTimeout para espear o tradutor carregar adequadamente
      this.help1 = this.tolltipCreateHelper.help1()
      this.help2 = this.tolltipCreateHelper.help2()
    }, 500)
  }


  // ⬇️ New Form TimeLineModel
  buildForm(): void {
    this.createTimeLineForm = this.fb.group({
      iam_id: new FormControl<string | null>(null, []),
      time_line: this.fb.group({
        flags: new FormArray([this.createFlagobject()])
      })
    });

    this.setDateTimestamp()
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
        day: new FormControl<string | null>(null, []),
        month: new FormControl<string | null>(null, []),
        month_s: new FormControl<string | null>(null, []),
        year: new FormControl<string | null>(null, []),
        month_code: new FormControl<number | null>(0, []),
        timestamp: new FormControl<number | null>(null, [Validators.required]),
        time: new FormControl<string | null>('12:00:00', []),
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

  toggleDatePicker(ref: any) {
    // console.log('++++++++++++++++==',ref._opened)
  }

  setDateTimestamp() {
    this.flagsForm.controls[0]?.get('date_obj')?.valueChanges
    .pipe(
      debounceTime(800), // digitação dentro do intervalo, ele espera pra fazer a busca
      distinctUntilChanged(), // Se eu digitar uma query - ele vai permitir apenas as msn que são diferentes umas das outras
    ).subscribe({
      next: (flag: DateObjModel) => {
        this.latitudeLongitude(flag)
      },
      error: (err) => { },
      complete: () => { }
    })
  }


  latitudeLongitude(flag: DateObjModel) {
    this.latitudeLongitudeService.latitudeLongitude()
    .subscribe({
      next: (res: any) => {

        console.log('sssssssssssssssssssssss',res)

        let datePicker = flag.day_month_year
        console.log('wwwwwww',datePicker)

        let time = flag.time
        console.log('wwwwwww',time)
        let currentlyDate = this.datePipe.transform(new Date(), 'medium'); // Date.parse(newDate);
        let userTimeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone; // Pega a região em que a pessoa se encontra
        console.log(userTimeZone)
      },
      error: (err) => { },
      complete: () => { }
    })
  }


  //================================= 🅰️🅰️ CREATE FLAG 🅰️🅰️ ==============================
  //==============================================================================
  vrifyTimestapnFlag() {


    // I need this filter to add the flag in the same year
    // let yearFlag = this.flags.filter((yearFlag: any) => yearFlag.year === this.createTimeLineForm.get('year')?.value);

  }


  createFlag() {
    if (this.createTimeLineForm.invalid) {
      this.matcher = new MyErrorStateMatcher();
      return
    }

    this.vrifyTimestapnFlag()
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
      console.log('ssssssss',flags)
      let colorFormats = this.convertColorService.convertColor(flags.at(0)?.get('flag_design')?.get('color_hex')?.value)
      flags.at(0)?.get('flag_design')?.get('color_hex')?.setValue(colorFormats.hex)
      flags.at(0)?.get('flag_design')?.get('color_rgb')?.setValue(colorFormats.rgb)
      flags.at(0)?.get('flag_design')?.get('color_hsl')?.setValue(colorFormats.hsl)

    }

}
