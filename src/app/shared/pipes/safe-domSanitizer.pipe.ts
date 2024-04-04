import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl} from '@angular/platform-browser';

@Pipe({ name: 'safeDomSanitizer' })
export class SafeDomSanitizerPipe implements PipeTransform {
  base64string!:string;
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    this.base64string = '';

    if(type === 'svg'){
      this.base64string = btoa(value);
      // return this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/svg+xml;base64,${base64string}`);
    }
    // if(url.includes('http')) {
    //   console.log('FOIO')
    //   return
    // }
    // return this.domSanitizer.bypassSecurityTrustResourceUrl(url);

    switch (type) {
			case 'html': return this.sanitizer.bypassSecurityTrustHtml(value); //  <div [innerHtml]="htmlSnippet | safeDomSanitizer: 'html'"></div>
			case 'style': return this.sanitizer.bypassSecurityTrustStyle(value); // style
			case 'script': return this.sanitizer.bypassSecurityTrustScript(value); // <script src>
			case 'url': return this.sanitizer.bypassSecurityTrustUrl(value); // <img src>
			case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value); // <script src>, ou <iframe src>.
      case 'svg': return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/svg+xml;base64,${this.base64string}`);;
			default: throw new Error(`Invalid safe type specified: ${type}`);
		}
  }
}
