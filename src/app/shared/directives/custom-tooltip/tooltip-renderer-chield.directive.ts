import { Directive, HostListener } from '@angular/core';
import { StateService } from '../../services/state.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Directive({
  selector: '[customToolTipChiel]'
})
export class ToolTipRendererChieldDirective {
  private tooltipVisible = false; // Estado para rastrear a visibilidade do tooltip

  constructor(
    private stateService: StateService,
    private deviceService: DeviceDetectorService
  ) { }

  // Para desktops: exibe o tooltip ao passar o mouse
  @HostListener('mouseenter', ['$event'])
  showChiel(e: any) {
    if (!this.deviceService.isMobile() && !this.deviceService.isTablet()) {
      this.tooltipVisible = true; // Mantém o tooltip visível
      this.stateService.toolTipSubject({ mouse: 'mouseenter', from: 'customToolTipChield' });
    }
  }

  // Para desktops: oculta o tooltip ao sair com o mouse
  @HostListener('mouseleave', ['$event'])
  hideChiel(e: any) {
    const targetElement = e.relatedTarget as HTMLElement; // Elemento relacionado que está entrando

    // Verifica se o mouse está saindo do elemento que ativou o tooltip e do próprio tooltip
    if (!this.deviceService.isMobile() && !this.deviceService.isTablet()) {
      if (targetElement && !targetElement.closest('[customToolTipChiel]')) {
        this.tooltipVisible = false; // Oculta o tooltip
        this.stateService.toolTipSubject({ mouse: 'mouseleave', from: 'customToolTipChield' });
      }
    }
  }

  // Para dispositivos móveis e tablets: exibe o tooltip ao tocar
  @HostListener('touchstart', ['$event'])
  onTouchStart(e: any) {
    this.tooltipVisible = true; // Mantém o tooltip visível
    this.stateService.toolTipSubject({ mouse: 'mouseenter', from: 'customToolTipChield' });
    e.stopPropagation(); // Previne a propagação do evento
  }

  // Para dispositivos móveis e tablets: evita que o tooltip feche ao soltar o toque
  @HostListener('touchend', ['$event'])
  onTouchEnd(e: any) {
    console.log('Touch end - tooltip remains open');
    e.stopPropagation(); // Previne a propagação do evento
    // Não feche o tooltip aqui, mantenha-o aberto
  }

  // Para dispositivos móveis e tablets: oculta o tooltip ao clicar fora
  @HostListener('document:touchstart', ['$event'])
  closeTooltipOnTouchOutside(e: any) {
    if (!this.tooltipVisible) return;

    const targetElement = e.target as HTMLElement;
    if (targetElement && !targetElement.closest('[customToolTipChiel]')) {
      this.tooltipVisible = false; // Oculta o tooltip
      this.stateService.toolTipSubject({ mouse: 'mouseleave', from: 'customToolTipChield' });
    }
  }
}
