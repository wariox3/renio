export interface RespuestaFacturaCompraZip {
  contacto: ContactoFacturaZip
  referencia_numero: string
  referencia_cue: string
  referencia_prefijo: string
  fecha: string
  comentario: string
}

export interface ContactoFacturaZip {
  id: number
  identificacion_id: number
  identificacion_abreviatura: string
  numero_identificacion: string
  digito_verificacion: any
  nombre_corto: string
  nombre1: any
  nombre2: any
  apellido1: any
  apellido2: any
  correo: string
  correo_facturacion_electronica: any
  telefono: string
  celular: any
  direccion: string
  ciudad_id: number
  ciudad_nombre: string
  departamento_nombre: string
  barrio: any
  codigo_postal: any
  tipo_persona_id: number
  tipo_persona: string
  regimen_id: number
  regimen_nombre: string
  codigo_ciuu: any
  numero_cuenta: any
  asesor_id: any
  asesor_nombre_corto: any
  precio_id: any
  precio_nombre: any
  plazo_pago_id: number
  plazo_pago_nombre: string
  plazo_pago_dias: number
  plazo_pago_proveedor_id: number
  plazo_pago_proveedor_nombre: string
  plazo_pago_proveedor_dias: number
  cliente: boolean
  proveedor: boolean
  empleado: boolean
  banco_id: any
  banco_nombre: string
  cuenta_banco_clase_id: any
  cuenta_banco_clase_nombre: string
}
