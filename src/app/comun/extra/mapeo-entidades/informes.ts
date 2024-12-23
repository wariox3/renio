import { MapeoDocumentos } from "@comun/type/mapeo-documentos.type";

export const documentos: MapeoDocumentos = {
  ventas_items: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
    {
      nombre: 'documento_tipo',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
    },
    {
      nombre: 'DOCUMENTO__NUMERO',
      campoTipo: 'IntegerField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
    {
      nombre: 'DOCUMENTO__FECHA',
      campoTipo: 'DateField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: false,
    },
    {
      nombre: 'Contacto',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
    },
    {
      nombre: 'ITEM_ID',
      nombreAbreviadoFiltro: 'ITEM_ID_FILTRO',
      nombreFiltroRelacion: 'ITEM__ID',
      campoTipo: 'CharField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: false,
    },
    {
      nombre: 'ITEM_NOMBRE',
      nombreAbreviadoFiltro: 'ITEM_NOMBRE_FILTRO',
      nombreFiltroRelacion: 'ITEM__NOMBRE',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'CANTIDAD',
      campoTipo: 'FloatField',
      visibleTabla: true,
      ordenable: false,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'PRECIO',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'TOTAL',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
  ],
  cuentas_cobrar: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
    {
      nombre: 'NUMERO',
      campoTipo: 'CharField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: false,
    },
    {
      nombre: 'FECHA',
      campoTipo: 'DateField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
    {
      nombre: 'FECHA_VENCE',
      campoTipo: 'DateField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
    },
    {
      nombre: 'FECHA_CONTABLE',
      campoTipo: 'DateField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'documento_tipo',
      nombreAbreviadoFiltro: 'DOCUMENTO_TIPO_ID_FILTRO',
      nombreFiltroRelacion: 'DOCUMENTO_TIPO_ID',
      campoTipo: 'Fk',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: false,
    },
    {
      nombre: 'documento_tipo_nombre',
      nombreAbreviadoFiltro: 'DOCUMENTO_TIPO_NOMBRE_FILTRO',
      nombreFiltroRelacion: 'DOCUMENTO_TIPO__NOMBRE',
      campoTipo: 'CharField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: false,
    },
    {
      nombre: 'CONTACTO_NUMERO_IDENTIFICACION',
      nombreAbreviado: 'CONTACTO_NUMERO_IDENTIFICACION',
      nombreAbreviadoFiltro: 'CONTACTO_IDENTIFICACION_FILTRO',
      nombreFiltroRelacion: 'CONTACTO__NUMERO_IDENTIFICACION',
      campoTipo: 'CharField',
      visibleTabla: false,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'CONTACTO_NOMBRE_CORTO',
      nombreAbreviadoFiltro: 'CONTACTO_NOMBRE_FILTRO',
      nombreFiltroRelacion: 'CONTACTO__NOMBRE_CORTO',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'BASE_IMPUESTO',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'DESCUENTO',
      campoTipo: 'FloatField',
      visibleTabla: false,
      ordenable: false,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'TOTAL',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'afectado',
      campoTipo: 'IntegerField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'PENDIENTE',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'ESTADO_ANULADO',
      nombreAbreviado: 'ESTADO_ANULADO_ABREVIATURA',
      campoTipo: 'Booleano',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: true,
    },
    {
      nombre: 'ESTADO_APROBADO',
      nombreAbreviado: 'ESTADO_APROBADO_ABREVIATURA',
      campoTipo: 'Booleano',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: true,
    },
    {
      nombre: 'ESTADO_ELECTRONICO',
      campoTipo: 'Booleano',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'ESTADO_ELECTRONICO_ENVIADO',
      campoTipo: 'Booleano',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'ESTADO_ELECTRONICO_NOTIFICADO',
      campoTipo: 'Booleano',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'DOCUMENTO_TIPO',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'METODO_PAGO',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'CONTACTO_ID',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'ITEM_NOMBRE',
      campoTipo: 'Fk',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
      esFk: true,
      modeloFk: 'GenItem',
    },
    {
      nombre: 'SOPORTE',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },

    {
      nombre: 'ORDEN_COMPRA',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'CUE',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'EMPRESA',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'RESOLUCION',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'DOCUMENTO_REFERENCIA',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'PLAZO_PAGO',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    },
    {
      nombre: 'COMENTARIO',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: false,
      ordenable: false,
    }
  ],
  cuentas_pagar: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
    {
      nombre: 'documento_tipo_nombre',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
    },
    {
      nombre: 'NUMERO',
      campoTipo: 'CharField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: false,
    },
    {
      nombre: 'FECHA',
      campoTipo: 'DateField',
      visibleFiltro: true,
      visibleTabla: true,
      ordenable: true,
    },
    {
      nombre: 'FECHA_VENCE',
      campoTipo: 'DateField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
    },
    {
      nombre: 'CONTACTO_ID',
      nombreAbreviado: 'CONTACTO_ID',
      nombreAbreviadoFiltro: 'CONTACTO_ID_FILTRO',
      nombreFiltroRelacion: 'CONTACTO__ID',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'CONTACTO_NUMERO_IDENTIFICACION',
      nombreAbreviado: 'CONTACTO_NUMERO_IDENTIFICACION',
      nombreAbreviadoFiltro: 'EMPLEADO_IDENTIFICACION_FILTRO',
      nombreFiltroRelacion: 'CONTACTO__NUMERO_IDENTIFICACION',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'CONTACTO',
      campoTipo: 'CharField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
    },
    // {
    //   nombre: 'FECHA_CONTABLE',
    //   campoTipo: 'DateField',
    //   visibleFiltro: false,
    //   visibleTabla: false,
    //   ordenable: false,
    // },

    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    // {
    //   nombre: 'BASE_IMPUESTO',
    //   campoTipo: 'FloatField',
    //   visibleFiltro: false,
    //   visibleTabla: false,
    //   ordenable: false,
    //   aplicaFormatoNumerico: true,
    // },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    // {
    //   nombre: 'DESCUENTO',
    //   campoTipo: 'FloatField',
    //   visibleTabla: false,
    //   ordenable: false,
    //   visibleFiltro: false,
    //   aplicaFormatoNumerico: true,
    // },
    {
      nombre: 'TOTAL',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'afectado',
      campoTipo: 'IntegerField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    {
      nombre: 'PENDIENTE',
      campoTipo: 'FloatField',
      visibleFiltro: false,
      visibleTabla: true,
      ordenable: false,
      aplicaFormatoNumerico: true,
    },
    // {
    //   nombre: 'ESTADO_ANULADO',
    //   nombreAbreviado: 'ESTADO_ANULADO_ABREVIATURA',
    //   campoTipo: 'Booleano',
    //   visibleFiltro: false,
    //   visibleTabla: false,
    //   ordenable: true,
    // },
    // {
    //   nombre: 'ESTADO_APROBADO',
    //   nombreAbreviado: 'ESTADO_APROBADO_ABREVIATURA',
    //   campoTipo: 'Booleano',
    //   visibleFiltro: false,
    //   visibleTabla: false,
    //   ordenable: true,
    // },
    // {
    //   nombre: 'ESTADO_ELECTRONICO',
    //   campoTipo: 'Booleano',
    //   visibleFiltro: false,
    //   visibleTabla: false,
    //   ordenable: false,
    // },
    // {
    //   nombre: 'ESTADO_ELECTRONICO_ENVIADO',
    //   campoTipo: 'Booleano',
    //   visibleFiltro: false,
    //   visibleTabla: false,
    //   ordenable: false,
    // },
    // {
    //   nombre: 'ESTADO_ELECTRONICO_NOTIFICADO',
    //   campoTipo: 'Booleano',
    //   visibleFiltro: false,
    //   visibleTabla: false,
    //   ordenable: false,
    // },
    // {
    //   nombre: 'DOCUMENTO_TIPO',
    //   campoTipo: 'CharField',
    //   visibleFiltro: false,
    //   visibleTabla: false,
    //   ordenable: false,
    // },
    // {
    //   nombre: 'METODO_PAGO',
    //   campoTipo: 'CharField',
    //   visibleFiltro: false,
    //   visibleTabla: false,
    //   ordenable: false,
    // },
    // {
    //   nombre: 'CONTACTO_NOMBRE_CORTO',
    //   nombreAbreviado: 'EMPLEADO',
    //   nombreAbreviadoFiltro: 'CONTACTO_NOMBRE_FILTRO',
    //   nombreFiltroRelacion: 'CONTACTO__NOMBRE_CORTO',
    //   campoTipo: 'CharField',
    //   visibleTabla: true,
    //   visibleFiltro: true,
    //   ordenable: true,
    // },
    // {
    //   nombre: 'ITEM_NOMBRE',
    //   campoTipo: 'Fk',
    //   visibleFiltro: false,
    //   visibleTabla: false,
    //   ordenable: false,
    //   esFk: true,
    //   modeloFk: 'GenItem',
    // },
    // {
    //   nombre: 'SOPORTE',
    //   campoTipo: 'CharField',
    //   visibleFiltro: false,
    //   visibleTabla: false,
    //   ordenable: false,
    // },

    // {
    //   nombre: 'ORDEN_COMPRA',
    //   campoTipo: 'CharField',
    //   visibleFiltro: false,
    //   visibleTabla: false,
    //   ordenable: false,
    // },
    // {
    //   nombre: 'CUE',
    //   campoTipo: 'CharField',
    //   visibleFiltro: false,
    //   visibleTabla: false,
    //   ordenable: false,
    // },
    // {
    //   nombre: 'EMPRESA',
    //   campoTipo: 'CharField',
    //   visibleFiltro: false,
    //   visibleTabla: false,
    //   ordenable: false,
    // },
    // {
    //   nombre: 'RESOLUCION',
    //   campoTipo: 'CharField',
    //   visibleFiltro: false,
    //   visibleTabla: false,
    //   ordenable: false,
    // },
    // {
    //   nombre: 'DOCUMENTO_REFERENCIA',
    //   campoTipo: 'CharField',
    //   visibleFiltro: false,
    //   visibleTabla: false,
    //   ordenable: false,
    // },
    // {
    //   nombre: 'PLAZO_PAGO',
    //   campoTipo: 'CharField',
    //   visibleFiltro: false,
    //   visibleTabla: false,
    //   ordenable: false,
    // },
    // {
    //   nombre: 'COMENTARIO',
    //   campoTipo: 'CharField',
    //   visibleFiltro: false,
    //   visibleTabla: false,
    //   ordenable: false,
    // }
  ],
  humano_nomina: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'NUMERO',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'FECHA',
      nombreAbreviado: 'DESDE',
      campoTipo: 'DateField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'FECHA_HASTA',
      nombreAbreviado: 'HASTA',
      campoTipo: 'DateField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'CONTACTO_ID',
      campoTipo: 'Fk',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      esFk: true,
    },
    {
      nombre: 'CONTACTO_NUMERO_IDENTIFICACION',
      nombreAbreviado: 'CONTACTO_NUMERO_IDENTIFICACION',
      nombreAbreviadoFiltro: 'EMPLEADO_IDENTIFICACION_FILTRO',
      nombreFiltroRelacion: 'CONTACTO__NUMERO_IDENTIFICACION',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'CONTACTO_NOMBRE_CORTO',
      nombreAbreviado: 'EMPLEADO',
      nombreAbreviadoFiltro: 'EMPLEADO_NOMBRE_FILTRO',
      nombreFiltroRelacion: 'CONTACTO__NOMBRE_CORTO',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'SALARIO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'DEVENGADO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'DEDUCCION',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'TOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'ESTADO_APROBADO',
      nombreAbreviado: 'ESTADO_APROBADO_ABREVIATURA',
      campoTipo: 'Booleano',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'ESTADO_ANULADO',
      nombreAbreviado: 'ESTADO_ANULADO_ABREVIATURA',
      campoTipo: 'Booleano',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
  ],
  humano_nomina_detalle: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'DOCUMENTO_ID',
      campoTipo: 'Fk',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      esFk: true,
    },
    {
      nombre: 'documento_contacto_numero_identificacion',
      nombreAbreviado: 'CONTACTO_NUMERO_IDENTIFICACION',
      nombreAbreviadoFiltro: 'EMPLEADO_IDENTIFICACION_FILTRO',
      nombreFiltroRelacion: 'DOCUMENTO__CONTACTO__NUMERO_IDENTIFICACION',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'documento_contacto_nombre_corto',
      nombreAbreviado: 'EMPLEADO',
      nombreAbreviadoFiltro: 'EMPLEADO_NOMBRE_FILTRO',
      nombreFiltroRelacion: 'DOCUMENTO__CONTACTO__NOMBRE_CORTO',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'documento_fecha',
      nombreFiltroRelacion: 'DOCUMENTO__FECHA',
      campoTipo: 'DateField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'documento_fecha_hasta',
      nombreFiltroRelacion: 'DOCUMENTO__FECHA_HASTA',
      campoTipo: 'DateField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'DETALLE',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
    },
    {
      nombre: 'PORCENTAJE',
      campoTipo: 'Porcentaje',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },

    {
      nombre: 'DIAS',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'HORA',
      nombreAbreviado: 'VALOR_HORA',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'OPERACION',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'PAGO',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'BASE_PRESTACION',
      nombreAbreviado: 'IBP',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'BASE_COTIZACION',
      nombreAbreviado: 'IBC',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'BASE_IMPUESTO',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
  ],
  humano_nomina_electronica: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'NUMERO',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'FECHA',
      campoTipo: 'DateField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'CONTACTO_ID',
      campoTipo: 'Fk',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      esFk: true,
    },
    {
      nombre: 'CONTACTO_NUMERO_IDENTIFICACION',
      nombreAbreviado: 'CONTACTO_NUMERO_IDENTIFICACION',
      nombreAbreviadoFiltro: 'EMPLEADO_IDENTIFICACION_FILTRO',
      nombreFiltroRelacion: 'CONTACTO__NUMERO_IDENTIFICACION',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'CONTACTO_NOMBRE_CORTO',
      nombreAbreviado: 'EMPLEADO',
      nombreAbreviadoFiltro: 'EMPLEADO_NOMBRE_FILTRO',
      nombreFiltroRelacion: 'CONTACTO__NOMBRE_CORTO',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'CONTRATO_ID',
      nombreAbreviado: 'CONT',
      toolTip: 'CONTRATO',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: true,
    },
    {
      nombre: 'SALARIO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'BASE_COTIZACION',
      nombreAbreviado: 'IBC',
      toolTip: "INGRESOBASECOTIZACION",
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'BASE_PRESTACION',
      nombreAbreviado: 'IBP',
      toolTip: "INGRESOBASEPRESTACION",
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'DEVENGADO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'DEDUCCION',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'TOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'ESTADO_APROBADO',
      nombreAbreviado: 'ESTADO_APROBADO_ABREVIATURA',
      toolTip: "ESTADO_APROBADO",
      campoTipo: 'Booleano',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'ESTADO_ANULADO',
      nombreAbreviado: 'ESTADO_ANULADO_ABREVIATURA',
      toolTip: "ESTADO_ANULADO",
      campoTipo: 'Booleano',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'ESTADO_ELECTRONICO',
      nombreAbreviado: 'ELE',
      toolTip: "ESTADOELECTRONICO",
      campoTipo: 'Booleano',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
  ],
  balance_prueba: [
    {
      nombre: 'ANIO',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'FECHA_DESDE',
      campoTipo: 'DateField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'FECHA_HASTA',
      campoTipo: 'DateField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
  ],
};
