export interface Usuario {
  id: number;
  username: string;
  imagen: string;
  imagen_thumbnail: string;
  nombre_corto: string;
  nombre: string | null;
  apellido: string | null;
  telefono: string | null;
  correo: string;
  idioma: string | null;
  dominio: string;
  fecha_limite_pago: Date;
  fecha_creacion: Date;
  vr_saldo: number;
  vr_credito: number;
  vr_abono: number;
  verificado: boolean;
  es_socio: boolean;
  socio_id: string;
  is_active: boolean;
  numero_identificacion: string;
  cargo: string;
}
