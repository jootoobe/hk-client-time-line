import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { TolltipModalSoublecheckerHelper } from "./tolltip-modal-doublechecker-helper";
import { DoubleCheckModel } from "../../models/time-line/time-line.model";



@Component({
  selector: 'modal-doublechecker',
  templateUrl: './modal-doublechecker.component.html',
  styleUrls: ['./modal-doublechecker.component.scss'],
  providers: []
})
export class ModalDoubleCheckerComponent implements OnInit, AfterViewInit {
  @Input({ required: false }) doubleCheckerDataInput!: DoubleCheckModel

  @ViewChild('doubleChecker', { static: false }) doubleChecker!: TemplateRef<any>; // open modal ref
  @Output() deleteFlagEmit = new EventEmitter<any>();


  @Output() clearBarFilterWhenDelete = new EventEmitter<any>();

  // dataDialogRef!: MatDialogRef<any>;

  @ViewChild(TolltipModalSoublecheckerHelper) tolltipModalSoublecheckerHelper!: TolltipModalSoublecheckerHelper;
  help1:string = ''

  constructor(
    private dialogCreate: MatDialog,
    // private filterFlagsService: FilterFlagsService
  ) { }
  ngOnInit(): void {

  }


  ngAfterViewInit(): void {
    setTimeout(() =>{ // aqui precisa de setTimeout para espear o tradutor carregar adequadamente
      // this.help1 = this.tolltipModalSoublecheckerHelper.help1()
    },2000)
  }

  // Open Create Time_Line
  openDoubleCheckerDialog(val?: string): void {

    this.dialogCreate.open(this.doubleChecker, {
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      data: this.doubleCheckerDataInput,
      panelClass: 'double-checker',
      // backdropClass: 'backdropBackground',
      position: {}

    });

    // if (this.dataSetting.modals?.types?.type === 'type-delete') {
    //   let valFilterClose: object = {
    //     color_hex: this.dataSetting.modals?.types?.flag?.color_hex,
    //   }

    //   this.clearBarFilterWhenDelete.emit(valFilterClose)

    //   this.filterFlagsService.clearFilter('clear') // input filter when the user creates a new flag, the filters are reset

    // }

    // // this.dataDialogRef.afterOpened().pipe()
    // // .subscribe(res=>{
    // // })
  }

  deleteFlag() {
    // if (this.dataSetting.modals.types.flag.social_medias_chips.length <= 0) {
    //   this.deleteFlagEmit.emit(true)
    //   return
    // }
  }



}
