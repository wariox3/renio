import { ResumenVencido } from "./resumen-vencido"
import { Resumen } from "./resumen-venta-dia"
import { ResumenVigente } from "./resumen-vigente"

export interface ResumenCobrar {
  resumen: Resumen
  resumen_vigente: ResumenVigente
  resumen_vencido: ResumenVencido
}

