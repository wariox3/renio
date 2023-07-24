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
}
