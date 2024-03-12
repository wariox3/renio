type ObjetoEjemplo = {
  [key: string]: {
    detalle: Promise<{ default: any }>;
    formulario: Promise<{ default: any }>;
    titulos?: {
      nombre: string;
      visibleTabla: boolean;
      visibleFiltro: boolean;
      ordenable: boolean;
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
      {
        nombre: 'ID',
        tipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'IDENTIFICACION_ABREVIATURA',
        tipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'NUMERO_IDENTIFICACION',
        tipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'DIGITO_VERIFICACION',
        tipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'NOMBRE_CORTO',
        tipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'CORREO',
        tipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'DIRECCION',
        tipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'NOMBRE1',
        tipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'NOMBRE2',
        tipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'APELLIDO1',
        tipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'APELLIDO2',
        tipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'CODIGO_POSTAL',
        tipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'TELEFONO',
        tipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'CELULAR',
        tipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'BARRIO',
        tipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'CODIGO_CIUU',
        tipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'CIUDAD_NOMBRE',
        tipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'REGIMEN_NOMBRE',
        tipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'TIPO_PERSONA',
        tipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
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
