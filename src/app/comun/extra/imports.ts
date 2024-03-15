type FormulariosYDetallesAsíncronos = {
  [key: string]: {
    detalle: Promise<{ default: any }>;
    formulario: Promise<{ default: any }>;
    titulos?: {
      nombre: string;
      visibleTabla: boolean;
      visibleFiltro: boolean;
      ordenable: boolean;
      aplicaFormatoNumerico?: boolean;
      tipo:
        | 'IntegerField'
        | 'FloatField'
        | 'CharField'
        | 'DateField'
        | 'Booleano';
    }[];
  };
};

export const Componetes: FormulariosYDetallesAsíncronos = {
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
    titulos: [
      {
        nombre: 'ID',
        tipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'NOMBRE',
        tipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'CODIGO',
        tipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'REFERENCIA',
        tipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'PRECIO',
        tipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'COSTO',
        tipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      }
    ],
  },
  Resolucion: {
    detalle: import(
      '../../modules/general/componentes/resolucion/resolucion-detalle/resolucion-detalle.component'
    ),
    formulario: import(
      '../../modules/general/componentes/resolucion/resolucion-formulario/resolucion-formulario.component'
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
        nombre: 'PREFIJO',
        tipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'NUMERO',
        tipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'CONSECUTIVO_DESDE',
        tipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'CONSECUTIVO_HASTA',
        tipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'FECHA_DESDE',
        tipo: 'DateField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'FECHA_HASTA',
        tipo: 'DateField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'AMBIENTE',
        tipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'CLAVE_TECNICA',
        tipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'SET_PRUEBA',
        tipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      }
    ],
  },
  Factura: {
    detalle: import(
      '../../modules/venta/componentes/factura/factura-detalle/factura-detalle.component'
    ),
    formulario: import(
      '../../modules/venta/componentes/factura/factura-formulario/factura-formulario.component'
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
        nombre: 'NUMERO',
        tipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'FECHA',
        tipo: 'DateField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'SUBTOTAL',
        tipo: 'FloatField',
        visibleTabla: true,
        visibleFiltro: false,
        aplicaFormatoNumerico: true,
        ordenable: false,
      },
      {
        nombre: 'IMPUESTO',
        tipo: 'FloatField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'TOTAL',
        tipo: 'FloatField',
        visibleTabla: true,
        visibleFiltro: false,
        aplicaFormatoNumerico: true,
        ordenable: false,
      },
      {
        nombre: 'ESTADO_APROBADO',
        tipo: 'Booleano',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      }
    ],
  },
};
