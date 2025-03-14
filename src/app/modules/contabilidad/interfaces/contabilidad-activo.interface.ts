export interface Activo {
  id: number;
  codigo: string;
  nombre: string;
  marca: string;
  serie: string;
  modelo: number;
  fecha_compra: string;
  fecha_activacion: string;
  fecha_baja: any;
  duracion: number;
  valor_compra: number;
  depreciacion_inicial: number;
  activo_grupo_id: number;
  metodo_depreciacion: number;
  cuenta_gasto: number;
  cuenta_depreciacion: number;
  grupo: number;
  activo_grupo_nombre: string;
  grupo_nombre: string;
  metodo_depreciacion_nombre: string;
  cuenta_gasto_nombre: string;
  cuenta_gasto_codigo: string;
  cuenta_depreciacion_nombre: string;
  cuenta_depreciacion_codigo: string;
}
