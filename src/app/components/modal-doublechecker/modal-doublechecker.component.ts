import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, effect, output } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { TolltipModalSoublecheckerHelper } from "./tolltip-modal-doublechecker-helper";
import { DoubleCheckModel } from "../../models/double-check-dialog/double-check-dialog.model";
import { StateService } from "../../shared/services/state.service";



@Component({
  selector: 'modal-doublechecker',
  templateUrl: './modal-doublechecker.component.html',
  styleUrls: ['./modal-doublechecker.component.scss'],
  providers: []
})
export class ModalDoubleCheckerComponent implements OnInit, AfterViewInit {
  @Input({ required: false }) doubleCheckerDataInput!: DoubleCheckModel

  @ViewChild('doubleChecker', { static: false }) doubleChecker!: TemplateRef<any>; // open modal ref
  deleteFlagOutput = output<boolean>();

  @ViewChild(TolltipModalSoublecheckerHelper) tolltipModalSoublecheckerHelper!: TolltipModalSoublecheckerHelper;
  help1:string = ''
  TIME_LINE: any
  constructor(
    private dialogCreate: MatDialog,
    private stateService: StateService,
  ) { 
    
    effect(() => {
      this.TIME_LINE = this.stateService.translatorLanguageSignalComputed()
      if(this.TIME_LINE) {
        this.help1 = this.tolltipModalSoublecheckerHelper.help1()
      }
    })
  }
  ngOnInit(): void {

  }


  ngAfterViewInit(): void {
    // setTimeout(() =>{ // aqui precisa de setTimeout para espear o tradutor carregar adequadamente
    //   this.help1 = this.tolltipModalSoublecheckerHelper.help1()
    // },2000)
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

  }

  deleteFlag() {
    this.deleteFlagOutput.emit(true)
  }



}
