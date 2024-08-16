export interface ProgramacionContrato {
    id: number
    fecha_desde: Date
    fecha_hasta: Date
    salario: number
    auxilio_transporte: boolean
    salario_integral: boolean
    estado_terminado: boolean
    comentario: string | null
    contrato_tipo_id: number
    contrato_tipo_nombre: string
    grupo_id: number
    grupo_nombre: string
    contacto_id: number
    contacto_numero_identificacion: string
    contacto_nombre_corto: string
    sucursal_id: number
    sucursal_nombre: string
    riesgo_id: number
    riesgo_nombre: string
    cargo_id: number
    cargo_nombre: string
    tipo_cotizante_id: number
    tipo_cotizante_nombre: string
    subtipo_cotizante_id: number
    subtipo_cotizante_nombre: string
    salud_id: number
    salud_nombre: string
    pension_id: number
    pension_nombre: string
  }
  