import { Component, effect } from "@angular/core";
import { StateService } from "../../../../../shared/services/state.service";


@Component({
  selector: 'tolltip-create-html', // remove word app- from microservices
  template: ``,
})
export class TolltipCreateHelper {

  TIME_LINE!: any; // translator used in ToastrService

  constructor(private stateService: StateService) {
    effect(() => {
      this.TIME_LINE = this.stateService.languageSignalComputed()
      console.log('TIME-LINE >>>>>>>>>>>>>>>>>>>>>.', this.TIME_LINE)
    })
  }

  // Alimenta o ToolTip {{'TIME-LINE.CREATE-FLAG.modal.title-h1' | translate}}
  help1() {
    let msn1_a: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help1-a']
    let msn1_b: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help1-b']
    let img1_a: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help1-img1-a']
    return `
    <div  style="height: auto; width:35rem;">
      <p>${msn1_a}</p>
      <p style="margin: 1rem 0 1rem 0;">${msn1_b}</p>
      <img  style="height: auto;width:100%" src="${img1_a}" alt="Spider Share">
    </div>
    `
  }


  help2() {
    let msn2_a: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help2-a']
    let msn2_b: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help2-b']
    let img2_a: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help2-img2-a']
    return `

    <div  style="height: auto; width:35rem;">
    <p>${msn2_a}</p>
    <p style="margin: .5rem 0 1rem 0;">${msn2_b}</p>
      <img  style="height: auto;width:100%" src="${img2_a}" alt="Spider Share">
    </div>

    `
  }


  help3() {
    let msn3_a: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help3-a']
    let msn3_b: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help3-b']
    let msn3_c: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help3-c']
    let msn3_d: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help3-d']
    let msn3_e: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help3-e']
    let msn3_f: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help3-f']
    // let img3_a:string  = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help3-img3-a']
    return `

    <div  style="height: auto; width:27rem; margin: .5rem ">
    <p>${msn3_a}.</p>
    <li style="margin: .5rem 0 1rem .5rem;">${msn3_b}</li>
    <li style="margin: .5rem 0 1rem .5rem;">${msn3_c}</li>
    <li style="margin: .5rem 0 1rem .5rem;">${msn3_d}o</li>
    <li style="margin: .5rem 0 1rem .5rem;">${msn3_e}</li>
    <li style="margin: .5rem 0 1rem .5rem;">${msn3_f}</li>
    </div>
    `
  }


  help4() {
    let msn4_a: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help4-a']
    let msn4_b: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help4-b']
    let msn4_c: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help4-c']
    let msn4_d: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help4-d']
    let msn4_e: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help4-e']
    let msn4_f: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help4-f']
    // let img3_a:string  = this.TIME_LINE['TOLLTIP-HTML-MSN']['CreateFlagComponent']['help3-img3-a']
    return `

    <div  style="height: auto; width:27rem; margin: .5rem ">
    <p>Altere as cores de contraste das redes</p>
    <li style="margin: .5rem 0 1rem .5rem;">Opção cor 01 - Fundo: <strong>preto</strong> com texto <strong>branco</strong></li>
    <li style="margin: .5rem 0 1rem .5rem;">Opção cor 02 - Fundo: <strong>branco</strong> com texto <strong>preto</strong></li>
    <li style="margin: .5rem 0 1rem .5rem;">Opção cor 03 - Fundo: <strong>preto</strong> com texto <strong>vermelho</strong></li>
    <li style="margin: .5rem 0 1rem .5rem;">Opção cor 04 - Fundo: <strong>vermelho</strong> com texto <strong>branco</strong></li>
    <li style="margin: .5rem 0 1rem .5rem;">Opção cor 05 - Fundo: <strong>preto</strong> com texto <strong>amarelo</strong></li>
    </div>
    `
  }



}











// <div  style="height: auto; width:27rem; margin: .5rem ">
// <p>Altere as cores dos textos seguindo as opções abaixo.</p>
// <li style="margin: .5rem 0 1rem .5rem;">Opção cor 01 - preto</li>
// <li style="margin: .5rem 0 1rem .5rem;">Opção cor 02 - branco</li>
// <li style="margin: .5rem 0 1rem .5rem;">Opção cor 03 - vermelho</li>
// <li style="margin: .5rem 0 1rem .5rem;">Opção cor 04 - azul</li>
// <li style="margin: .5rem 0 1rem .5rem;">Opção cor 05 - amarelo</li>
// </div>

























// emailForgotPassword = function (options:any) {

//   return `
//   <html lang="pt-br">

//   <head>
//     <title>Alterar Senha</title>
//     <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
//   </head>

//   <body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
//     <table id="Tabela_01" width="600" height="auto" border="0" cellpadding="0" cellspacing="0" align="center"
//       style="font-family: arial">

//       <tr style="background-color: #8261a7;">
//         <td colspan="6" style="text-align: center;">
//           <div style="height: 80px; margin-top: 30px;">
//           <p style="text-align: center; font-size: 40px; color: #FFF; font-weight: bold">Spider Share</p>
//           </div>
//           <div>
//             <p style="text-align: center; font-size: 25px; color: #FFF; font-weight: bold">Olá, ${options}</p>
//             <p style="text-align: center ; font-size: 16px; color: #FFF; font-weight: bold; margin: 0 0 25px 0;" >
//             Obrigado pelo cadastro !!! 😊
//           </p>
//           </div>
//         </td>
//       </tr>

//       <tr style="background-color: #4daccc;">
//         <td colspan="6" style="text-align: center; ">
//           <div>
//             <p style="text-align: center; font-size: 16px; margin-top: 50px ">Clique no botão abaixo</p>
//             <p style="text-align: center; font-size: 16px; margin: 10px">  para autenticar o seu cadastro:</p>
//           </div>
//           <div>
//             <p style="text-align: center; font-size: 18px; color:#002855; font-weight: bold;margin: 50px 0 10px 0;">
//               Verificando cadastro 👇
//             </p>
//             <p style="text-align: center; font-size: 18px; color:#002855; font-weight: bold;margin: 50px 0 10px 0;">
//              <p>Senha: Vamo Que Vamo</p>
//           </p>
//           </div>

//           <div>
//            <img src="https://miro.medium.com/v2/resize:fill:64:64/1*0CWrzWHjHhJT2nKABRopKQ.png" style="width="auto" height="auto"" >
//           </div>
//         </td>
//       </tr>
//     </table>
//   </body>
//   </html>

//   `
// }
