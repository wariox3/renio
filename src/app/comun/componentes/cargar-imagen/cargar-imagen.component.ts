import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent, ImageCropperModule, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';

@Component({
  selector: 'app-cargar-imagen',
  templateUrl: './cargar-imagen.component.html',
  styleUrls: ['./cargar-imagen.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ImageCropperModule,
    TranslateModule,
    TranslationModule,
  ]
})
export class CargarImagenComponent {

  constructor(
    private modalService: NgbModal,
    private sanitizer: DomSanitizer
  ){

  }

  srcResult: string = '/metronic8/demo1/assets/media/svg/avatars/blank.svg';
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  modalRef: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  base64: string | ArrayBuffer = '';
  @Output() dataFormulario: EventEmitter<any> = new EventEmitter();
  @Output() eliminarLogo: EventEmitter<any> = new EventEmitter();
  @Input() recibirImagen : string | null = ''

  archivoSeleccionado(event: any) {    
    if(event.target.files.length > 0){
      this.modalRef = this.modalService.open(this.customTemplate, { backdrop: 'static' });
      this.imageChangedEvent = event;
  
  
      if (typeof FileReader !== 'undefined') {
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          this.srcResult = e.target.result;
        };
        reader.readAsDataURL(this.imageChangedEvent.target.files[0]);
      }
      event.target.files = null;
    }
  }

  removerArchivoSeleccionado() {
    this.base64 = ''
    this.srcResult = '/metronic8/demo1/assets/media/svg/avatars/blank.svg';
    return this.eliminarLogo.emit(true);

  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    var reader = new FileReader();
    if(event.blob){
      const convertedBlob = event.blob.slice(0, event.blob.size, 'image/jpeg');
      reader.readAsDataURL(convertedBlob);
      reader.onloadend = () => {
        if(reader.result){
          this.base64 = reader.result
          
        }
      } 
    }

    if(event.objectUrl){
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    }
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  emitirBase64(){
    this.modalService.dismissAll();
    return this.dataFormulario.emit(this.base64);
  }

}
