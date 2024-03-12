type ObjetoEjemplo = {
  [key: string]: {
    detalle: Promise<{ default: any }>;
    formulario: Promise<{ default: any }>;
    titulos?: {
      nombre: string;
      visitabletabla: boolean;
      tipo:
        | 'IntegerField'
        | 'FloatField'
        | 'CharField'
        | 'DateField'
        | 'Booleano';
    }[];
  };
};

export const Componetes: ObjetoEjemplo = {
  Contacto: {
    detalle: import(
      '../../modules/general/componentes/contacto/contacto-detalle/contacto-detalle.component'
    ),
    formulario: import(
      '../../modules/general/componentes/contacto/contacto-formulario/contacto-formulario.component'
    ),
    titulos: [
      { nombre: 'ID', tipo: 'IntegerField', visitabletabla: true },
      {
        nombre: 'IDENTIFICACION_ABREVIATURA',
        tipo: 'IntegerField',
        visitabletabla: false,
      },
      {
        nombre: 'NUMERO_IDENTIFICACION',
        tipo: 'CharField',
        visitabletabla: false,
      },
      {
        nombre: 'DIGITO_VERIFICACION',
        tipo: 'CharField',
        visitabletabla: false,
      },
      { nombre: 'NOMBRE_CORTO', tipo: 'CharField', visitabletabla: true },
      { nombre: 'CORREO', tipo: 'CharField', visitabletabla: false },
      { nombre: 'DIRECCION', tipo: 'CharField', visitabletabla: false },
      { nombre: 'NOMBRE1', tipo: 'CharField', visitabletabla: false },
      { nombre: 'NOMBRE2', tipo: 'CharField', visitabletabla: false },
      { nombre: 'APELLIDO1', tipo: 'CharField', visitabletabla: false },
      { nombre: 'APELLIDO2', tipo: 'CharField', visitabletabla: false },
      { nombre: 'CODIGO_POSTAL', tipo: 'CharField', visitabletabla: false },
      { nombre: 'TELEFONO', tipo: 'CharField', visitabletabla: true },
      { nombre: 'CELULAR', tipo: 'CharField', visitabletabla: true },
      { nombre: 'BARRIO', tipo: 'CharField', visitabletabla: false },
      { nombre: 'CODIGO_CIUU', tipo: 'CharField', visitabletabla: false },
      { nombre: 'CIUDAD_NOMBRE', tipo: 'CharField', visitabletabla: false },
      { nombre: 'REGIMEN_NOMBRE', tipo: 'CharField', visitabletabla: false },
      { nombre: 'TIPO_PERSONA', tipo: 'CharField', visitabletabla: false },
    ],
  },
  Item: {
    detalle: import(
      '../../modules/general/componentes/item/item-detalle/item-detalle.component'
    ),
    formulario: import(
      '../../modules/general/componentes/item/item-formulario/item-formulario.component'
    ),
    //titulos: ['ID', 'CODIGO', 'NOMBRE', 'REFERENCIA', 'COSTO', 'PRECIO'],
  },
  Resolucion: {
    detalle: import(
      '../../modules/general/componentes/resolucion/resolucion-detalle/resolucion-detalle.component'
    ),
    formulario: import(
      '../../modules/general/componentes/resolucion/resolucion-formulario/resolucion-formulario.component'
    ),
    // titulos: [
    //   'ID',
    //   'PREFIJO',
    //   'NUMERO',
    //   'CONSECUTIVO_DESDE',
    //   'CONSECUTIVO_HASTA',
    //   'FECHA_DESDE',
    //   'FECHA_HASTA',
    // ],
  },
  Factura: {
    detalle: import(
      '../../modules/venta/componentes/factura/factura-detalle/factura-detalle.component'
    ),
    formulario: import(
      '../../modules/venta/componentes/factura/factura-formulario/factura-formulario.component'
    ),
    // titulos: [
    //   'ID',
    //   'Numero',
    //   'Fecha',
    //   'Vence',
    //   'Descuento',
    //   'Subtotal',
    //   'Impuesto',
    //   'Total',
    //   'APR',
    //   'contacto',
    //   'documento_tipo',
    //   'metodo_pago',
    // ],
  },
};
