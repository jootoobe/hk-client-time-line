import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { StateService } from "../../../../../shared/services/state.service";


@Component({
  selector: 'create-flag', // remove word app- from microservices
  templateUrl: './create-flag.component.html',
  styleUrls: ['./create-flag.component.scss',]
})

export class CreateFlagComponent implements OnInit, OnChanges, AfterViewInit {
  createTimeLineForm!: FormGroup


  constructor(private fb: FormBuilder, private stateService: StateService,) { }


  ngOnChanges(changes: SimpleChanges) {

  }


  ngOnInit(): void {
    this.buildForm()

  }

  ngAfterViewInit(): void {

  }


  // ⬇️ New Form TimeLineModel
  buildForm(): void {
    this.createTimeLineForm = this.fb.group({
      iam_id: new FormControl<string | null>(null, []),
      time_line: this.fb.group({
        flags: new FormArray([this.createFlag()])
      })
    });
  }

  createFlag(): FormGroup {
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

}
