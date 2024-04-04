import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { StateService } from "../../../../../shared/services/state.service";
import { TolltipCreateHelper } from "./tolltip-create-helper";
import { MyErrorStateMatcher } from "../../../../../shared/validators/err/invalid-control";
import { MatDatepickerTimeHeaderComponent } from "../../../../../components/datepicker-time/mat-datepicker-time-header.component";
import { ConvertColorService } from "../../../../../shared/services/convert-color.service";
import { MatRadioChange } from "@angular/material/radio";


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
  radioRedeTextColor = '1' // text colors
  radioRedeNets = { background: 'black', text: 'white' }
  radioRedeTransparency = '0.2'
  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private convertColorService: ConvertColorService,
  ) {


    this.buildForm()

  }


  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    setTimeout(() => { // aqui precisa de setTimeout para espear o tradutor carregar adequadamente

      this.help1 = this.tolltipCreateHelper.help1()
      this.help2 = this.tolltipCreateHelper.help2()

    }, 2000)
  }


  // ⬇️ New Form TimeLineModel
  buildForm(): void {
    this.createTimeLineForm = this.fb.group({
      iam_id: new FormControl<string | null>(null, []),
      time_line: this.fb.group({
        flags: new FormArray([this.createFlag()])
      })
    });

    console.log('wwwwwwwww', this.createTimeLineForm.get('time_line')?.get('flags'))
  }

  createFlag(): FormGroup {

    // public color_text: string,
    // public color_nets: {background: string, text: string},
    // public color_transparency: string,
    // public color_hex: string,
    // public color_rgb: string,
    // public color_hsl: string,


    return this.fb.group({
      year: new FormControl<string | null>(null + this.stateService.getUniqueId(5), [Validators.required, Validators.minLength(32), Validators.maxLength(35)]),
      flag_id: new FormControl<string | null>('flag_id_' + this.stateService.getUniqueId(5), [Validators.required, Validators.minLength(32), Validators.maxLength(35)]),
      flag_title: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      flag_description: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(500)]),
      flag_style: new FormControl<any | null>(null, [Validators.required]),
      flag_style2: new FormControl<any | null>(null, []),

      color_hex: new FormControl<string | null>('#90ab3d', []),
      color_rgb: new FormControl<string | null>('144, 171, 64', []),
      color_hsl: new FormControl<string | null>('75, 46%, 92%', []),

      flag_local_zone: new FormControl<string | null>(null, []),
      flag_created_at: new FormControl<string | null>(null, []),
      flag_update_at: new FormControl<string | null>('0', []),
      flag_margin_right: new FormControl<string | null>('0', []),

      flag_design: this.fb.group({
        color_text: new FormControl<string | null>(null, [Validators.required]), // A data day_month_year está com o horário certo
        color_nets: this.fb.group({
          background: new FormControl<string | null>(null, [Validators.required]),
          text: new FormControl<string | null>(null, [Validators.required]),
        }),
        color_transparency: new FormControl<string | null>(null, [Validators.required]),
        color_hex: new FormControl<string | null>('#90ab3d', [Validators.required]),
        color_rgb: new FormControl<string | null>('144, 171, 64', [Validators.required]),
        color_hsl: new FormControl<string | null>('75, 46%, 92%', [Validators.required]),
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
    });

  }


  // ⬇️ Get Flag form
  get flagsForm() {
    return this.createTimeLineForm.get('time_line')?.get('flags') as FormArray
  }


  toggleDatePicker(ref: any) {
    // if (!ref.opened) {
    //   // this.updateSecondFlagSpace.emit(false)
    //   this.geToTimestamp()
    // }
  }


  //⬇️ Convert Color
  convertColor() {
    // this.createTimeLineForm.value.flags[0]['color_hex']
    let colorFormats = this.convertColorService.convertColor(this.createTimeLineForm.value.flags[0]['color_hex'])
    let flags = this.createTimeLineForm.get('time_line')?.get('flags') as FormArray
    // flags.at(0).get('color_hex')?.setValue(this.createTimeLineForm.value.flags[0]['color_hex'])
    flags.at(0).get('color_hex')?.setValue(colorFormats.hex)
    flags.at(0).get('color_rgb')?.setValue(colorFormats.rgb)
    flags.controls[0].get('color_hsl')?.setValue(colorFormats.hsl)

  }




  onRadioButtonTextColor(e: MatRadioChange) {
    console.log('11', e)

  }

  onRadioButtonNetsColor(e: MatRadioChange) {
    console.log('22', e)


  }

  onRadioButtonTransparencyColor(e: MatRadioChange) {
    console.log('22', e)


  }

}
