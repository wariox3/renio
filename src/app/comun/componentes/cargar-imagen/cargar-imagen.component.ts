import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ImageCroppedEvent,
  ImageCropperModule,
  LoadedImage,
} from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { General } from '@comun/clases/general';

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
  ],
})
export class CargarImagenComponent extends General implements OnChanges {
  constructor(private modalService: NgbModal, private sanitizer: DomSanitizer) {
    super();
  }

  srcResult: string = '/metronic8/demo1/assets/media/svg/avatars/blank.svg';
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  @ViewChild('fileInput') fileInput !: ElementRef<HTMLInputElement>
  modalRef: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  base64: string | ArrayBuffer = '';
  visualizarRemoverImagen = false;
  @Output() dataFormulario: EventEmitter<any> = new EventEmitter();
  @Output() eliminarLogo: EventEmitter<any> = new EventEmitter();
  @Input() recibirImagen: string | null = '';

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.recibirImagen);
    if (this.recibirImagen) {
      if(!this.recibirImagen.includes('defecto')){
        this.visualizarRemoverImagen = true;
        this.changeDetectorRef.detectChanges()
      }
    }
  }

  archivoSeleccionado(event: any) {
    this.visualizarRemoverImagen = true;
    if (event.target.files.length > 0) {
      this.modalRef = this.modalService.open(this.customTemplate, {
        backdrop: 'static',
        keyboard: false
      });
      this.imageChangedEvent = event;

      if (typeof FileReader !== 'undefined') {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.srcResult = e.target.result;
        };
        reader.readAsDataURL(this.imageChangedEvent.target.files[0]);
      }
      event.target.files = null;
      this.changeDetectorRef.detectChanges();
    }
  }

  removerArchivoSeleccionado() {
    console.log(this.recibirImagen);

    if(this.recibirImagen?.includes('defecto')){
      this.visualizarRemoverImagen = false;
      this.changeDetectorRef.detectChanges()
    }
    this.base64 = '';
    return this.eliminarLogo.emit(true);
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    var reader = new FileReader();
    if (event.blob) {

      const convertedBlob = event.blob.slice(0, event.blob.size, 'image/jpeg');
      reader.readAsDataURL(convertedBlob);
      reader.onloadend = () => {
        if (reader.result) {
          this.base64 = reader.result;
        }
      };
    }

    if (event.objectUrl) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(
        event.objectUrl
      );
    }
  }
  imageLoaded(image: LoadedImage) {
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
  }

  emitirBase64() {
    this.fileInput.nativeElement.value = '';
    this.modalRef.close();
    this.changeDetectorRef.detectChanges()
    return this.dataFormulario.emit(this.base64);
  }

  cerrarModal(){
    this.fileInput.nativeElement.value = '';
    this.base64 = ''
    this.visualizarRemoverImagen = false
    this.modalRef.dismiss('Cross click')
  }


}
