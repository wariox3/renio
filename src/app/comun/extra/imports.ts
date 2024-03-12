type ObjetoEjemplo = {
  [key: string]: {
    detalle: Promise<{ default: any }>;
    formulario: Promise<{ default: any }>;
    titulos?: {
      nombre: string,
      visitabletabla: boolean,
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
    titulos : [
      { nombre: 'ID', visitabletabla: true },
      { nombre: 'IDENTIFICACION', visitabletabla: false },
      { nombre: 'NUMERO_IDENTIFICACION', visitabletabla: false },
      { nombre: 'NOMBRE_CORTO', visitabletabla: true },
      { nombre: 'CORREO', visitabletabla: false },
      { nombre: 'DIRECCION', visitabletabla: false },
      { nombre: 'CIUDAD_NOMBRE', visitabletabla: false },
      { nombre: 'DIGITO_VERIFICACION', visitabletabla: false },
      { nombre: 'NOMBRE1', visitabletabla: false },
      { nombre: 'NOMBRE2', visitabletabla: false },
      { nombre: 'APELLIDO1', visitabletabla: false },
      { nombre: 'APELLIDO2', visitabletabla: false },
      { nombre: 'DIRECCION', visitabletabla: false },
      { nombre: 'CODIGO_POSTAL', visitabletabla: false },
      { nombre: 'TELEFONO', visitabletabla: true },
      { nombre: 'CELULAR', visitabletabla: true },
      { nombre: 'BARRIO', visitabletabla: false },
      { nombre: 'CODIGO_CIUU', visitabletabla: false },
      { nombre: 'CIUDAD_NOMBRE', visitabletabla: false },
      { nombre: 'IDENTIFICACION_NOMBRE', visitabletabla: false },
      { nombre: 'IDENTIFICACION_ID', visitabletabla: false },
      { nombre: 'CIUDAD_ID', visitabletabla: false },
      { nombre: 'REGIMEN', visitabletabla: false },
      { nombre: 'TIPO_PERSONA', visitabletabla: false },
    ]
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
