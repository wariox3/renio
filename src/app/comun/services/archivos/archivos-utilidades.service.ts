import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ArchivosUtilidadesService {
  formatFileSize(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
    return `${size} ${sizes[i]}`;
  }
}
