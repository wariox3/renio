import { MapeoDocumentos } from "@interfaces/mapeo/mapeo";

export const documentos: MapeoDocumentos = {
  100: [
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
      nombre: 'CONTACTO_NOMBRE_CORTO',
      campoTipo: 'Fk',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
      esFk: true,
      modeloFk: 'Contacto',
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      aplicaFormatoNumerico: true,
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
    {
      nombre: 'ESTADO_ELECTRONICO',
      nombreAbreviado: 'ESTADO_ELECTRONICO_ABREVIATURA',
      campoTipo: 'Booleano',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
  ],
  101: [
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
      nombre: 'CONTACTO_NOMBRE_CORTO',
      campoTipo: 'Fk',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      esFk: true,
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      aplicaFormatoNumerico: true,
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
  102: [
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
      nombre: 'CONTACTO_NOMBRE_CORTO',
      campoTipo: 'Fk',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      esFk: true,
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      aplicaFormatoNumerico: true,
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
  200: [
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
      nombre: 'CONTACTO_NOMBRE_CORTO',
      campoTipo: 'Fk',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
      esFk: true,
      modeloFk: 'Contacto',
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleTabla: false,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleTabla: false,
      visibleFiltro: false,
      ordenable: false,
      aplicaFormatoNumerico: true,
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
      visibleFiltro: false,
      ordenable: false,
    },
    {
      nombre: 'ESTADO_ANULADO',
      nombreAbreviado: 'ESTADO_ANULADO_ABREVIATURA',
      campoTipo: 'Booleano',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
    },
  ],
  300: [
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
      nombre: 'CONTACTO_NOMBRE_CORTO',
      campoTipo: 'Fk',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      esFk: true,
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      aplicaFormatoNumerico: true,
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
  301: [
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
      nombre: 'CONTACTO_NOMBRE_CORTO',
      campoTipo: 'Fk',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      esFk: true,
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      aplicaFormatoNumerico: true,
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
  302: [
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
      nombre: 'CONTACTO_NOMBRE_CORTO',
      campoTipo: 'Fk',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      esFk: true,
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      aplicaFormatoNumerico: true,
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
  303: [
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
      nombre: 'CONTACTO_NOMBRE_CORTO',
      campoTipo: 'Fk',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      esFk: true,
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      aplicaFormatoNumerico: true,
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
  304: [
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
      nombre: 'CONTACTO_NOMBRE_CORTO',
      campoTipo: 'Fk',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      esFk: true,
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      aplicaFormatoNumerico: true,
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
  400: [
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
      nombre: 'CONTACTO_NOMBRE_CORTO',
      campoTipo: 'Fk',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      esFk: true,
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      aplicaFormatoNumerico: true,
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
  500: [
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
      nombre: 'CONTACTO_NOMBRE_CORTO',
      campoTipo: 'Fk',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      esFk: true,
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      aplicaFormatoNumerico: true,
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
  501: [
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
      nombre: 'CONTACTO_NOMBRE_CORTO',
      campoTipo: 'Fk',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      esFk: true,
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      aplicaFormatoNumerico: true,
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
  601: [
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
      nombre: 'CONTACTO_NOMBRE_CORTO',
      campoTipo: 'Fk',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      esFk: true,
    },
    {
      nombre: 'SUBTOTAL',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'IMPUESTO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
      aplicaFormatoNumerico: true,
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
  HumProgramacion: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'FECHA_DESDE',
      campoTipo: 'DateField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'FECHA_HASTA',
      campoTipo: 'DateField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'NOMBRE',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
  ],
  HumAdicional: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'CONTRATO_CONTACTO_ID',
      campoTipo: 'CharField',
      visibleTabla: false,
      visibleFiltro: false,
      ordenable: false,
    },
    {
      nombre: 'CONTRATO_CONTACTO_NUMERO_IDENTIFICACION',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'CONTRATO_CONTACTO_NOMBRE_CORTO',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'VALOR',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'HORAS',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'APLICA_DIA_LABORADO',
      nombreAbreviado: 'APLICA_DIA_LABORADO_ABREVIATURA',
      campoTipo: 'Booleano',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
    {
      nombre: 'DETALLE',
      campoTipo: 'CharField',
      visibleTabla: false,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'CONCEPTO',
      campoTipo: 'CharField',
      visibleTabla: false,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'CONTRATO',
      campoTipo: 'CharField',
      visibleTabla: false,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
  ],
  HumCredito: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'CONTRATO_CONTACTO_ID',
      campoTipo: 'CharField',
      visibleTabla: false,
      visibleFiltro: false,
      ordenable: false,
    },
    {
      nombre: 'CONTRATO_CONTACTO_NUMERO_IDENTIFICACION',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'CONTRATO_CONTACTO_NOMBRE_CORTO',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'FECHA_INICIO',
      campoTipo: 'DateField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'CUOTA',
      campoTipo: 'IntegerField',
      alinearAlaIzquierda: true,
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'CANTIDAD_CUOTAS',
      alinearAlaIzquierda: true,
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
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
      nombre: 'VALIDAR_CUOTAS',
      nombreAbreviado: 'VALIDAR_CUOTAS_ABREVIATURA',
      campoTipo: 'Booleano',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: false,
    },
  ],
  HumNovedad: [
    {
      nombre: 'ID',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'CONTRATO_CONTACTO_ID',
      campoTipo: 'CharField',
      visibleTabla: false,
      visibleFiltro: false,
      ordenable: false,
    },
    {
      nombre: 'CONTRATO_CONTACTO_NUMERO_IDENTIFICACION',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'CONTRATO_CONTACTO_NOMBRE_CORTO',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'FECHA_DESDE',
      campoTipo: 'DateField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'FECHA_HASTA',
      campoTipo: 'DateField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
  ],
  ConMovimiento: [
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
      nombre: 'COMPROBANTE',
      campoTipo: 'CharField',
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
      nombre: 'CONTACTO_NOMBRE_CORTO',
      campoTipo: 'CharField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'CUENTA',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'GRUPO',
      campoTipo: 'IntegerField',
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: 'DEBITO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'CREDITO',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
    {
      nombre: 'BASE',
      campoTipo: 'FloatField',
      visibleTabla: true,
      visibleFiltro: false,
      aplicaFormatoNumerico: true,
      ordenable: false,
    },
  ],
};
