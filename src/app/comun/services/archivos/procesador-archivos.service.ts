import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProcesadorArchivosService {
  /**
   * Convierte un archivo a una cadena Base64
   * @param file Archivo a convertir
   * @returns Promise con la representación en Base64 del archivo
   */
  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string); // Devuelve la cadena Base64
      };

      reader.onerror = (error) => {
        reject(error); // Manejo de errores en la lectura del archivo
      };

      reader.readAsDataURL(file); // Convierte el archivo a Base64
    });
  }
}
