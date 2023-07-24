import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FechasService {

  constructor() { }

  obtenerPrimerDiaDelMes(date: Date): string {
    // Obtener el primer día del mes
    const primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
  
    // Formatear la fecha en "año-mes-dia"
    const primerDiaFormateado = primerDia.toISOString().split("T")[0];
    return primerDiaFormateado;
  }
  
  obtenerUltimoDiaDelMes(date: Date): string {
    // Obtener el primer día del próximo mes
    const primerDiaDelSiguienteMes = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  
    // Restar un día al primer día del próximo mes para obtener el último día del mes actual
    const ultimoDia = new Date(primerDiaDelSiguienteMes.getTime() - 1);
    ultimoDia.setDate(ultimoDia.getDate() - 1); // Retroceder al último día del mes actual
  
    // Formatear la fecha en "año-mes-dia"
    const ultimoDiaFormateado = ultimoDia.toISOString().split("T")[0];
    return ultimoDiaFormateado;
  }

  obtenerPrimerDiaDelMesSiguiente(): string {
    const fechaActual = new Date();
    // Obtenemos el mes actual
    const mesActual = fechaActual.getMonth();
  
    // Incrementamos el mes para obtener el mes siguiente
    const mesSiguiente = mesActual + 1;
  
    // Configuramos la fecha para el primer día del mes siguiente
    const primerDiaDelMesSiguiente = new Date(fechaActual.getFullYear(), mesSiguiente, 1);
  
    // Obtenemos los componentes de la fecha (año, mes y día)
    const año = primerDiaDelMesSiguiente.getFullYear();
    const mes = String(primerDiaDelMesSiguiente.getMonth() + 1).padStart(2, '0'); // Agregamos ceros iniciales si el mes es menor a 10
    const dia = String(primerDiaDelMesSiguiente.getDate()).padStart(2, '0'); // Agregamos ceros iniciales si el día es menor a 10
  
    // Retornamos la fecha en formato "año-mes-dia"
    return `${año}-${mes}-${dia}`;
  }
  
}
