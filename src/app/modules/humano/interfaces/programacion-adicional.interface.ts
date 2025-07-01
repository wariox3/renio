import { RespuestaProgramacionDetalleAdicionales } from './respuesta-programacion-adicionales.interface';

export interface ProgramacionAdicional {
  registros: RespuestaProgramacionDetalleAdicionales[];
  cantidad_registros: number;
}

export interface ProgramacionAdicionalDetalle {
  id: number;
  valor: number;
  horas: number;
  aplica_dia_laborado: boolean;
  detalle: any;
  concepto: number;
  contrato: number;
  programacion: number;
  permanente: boolean;
  inactivo: boolean;
  concepto__nombre: string;
  contrato__contacto__numero_identificacion: string;
  contrato__contacto__nombre_corto: string;
}
  