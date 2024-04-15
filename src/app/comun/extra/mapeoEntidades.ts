type Mapeo = {
  [key: string]: {
    modulo?:
      | 'compra'
      | 'venta'
      | 'contabilidad'
      | 'cartera'
      | 'humano'
      | 'general';
    modelo: string;
    tipo: 'Administrador' | 'Movimiento';
    datos: {
      nombre: string;
      visibleTabla: boolean;
      visibleFiltro: boolean;
      ordenable: boolean;
      aplicaFormatoNumerico?: boolean;
      campoTipo:
        | 'IntegerField'
        | 'FloatField'
        | 'CharField'
        | 'DateField'
        | 'Booleano';
    }[];
  };
};

export const mapeo: Mapeo = {
  Contacto: {
    modulo: 'general',
    modelo: 'contacto',
    tipo: 'Administrador',
    datos: [
      {
        nombre: 'ID',
        campoTipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'IDENTIFICACION_ABREVIATURA',
        campoTipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'NUMERO_IDENTIFICACION',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'DIGITO_VERIFICACION',
        campoTipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'NOMBRE_CORTO',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'CORREO',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'DIRECCION',
        campoTipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'NOMBRE1',
        campoTipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'NOMBRE2',
        campoTipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'APELLIDO1',
        campoTipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'APELLIDO2',
        campoTipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'CODIGO_POSTAL',
        campoTipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'TELEFONO',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'CELULAR',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'BARRIO',
        campoTipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'CODIGO_CIUU',
        campoTipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'CIUDAD_NOMBRE',
        campoTipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'REGIMEN_NOMBRE',
        campoTipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'TIPO_PERSONA',
        campoTipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
    ],
  },
  Item: {
    modulo: 'general',
    modelo: 'item',
    tipo: 'Administrador',
    datos: [
      {
        nombre: 'ID',
        campoTipo: 'IntegerField',
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
      {
        nombre: 'CODIGO',
        campoTipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'REFERENCIA',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'PRECIO',
        campoTipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
        aplicaFormatoNumerico: true,
      },
      {
        nombre: 'COSTO',
        campoTipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
        aplicaFormatoNumerico: true,
      },
      {
        nombre: 'PRODUCTO',
        campoTipo: 'Booleano',
        visibleTabla: false,
        visibleFiltro: true,
        ordenable: false,
      },
      {
        nombre: 'SERVICIO',
        campoTipo: 'Booleano',
        visibleTabla: false,
        visibleFiltro: true,
        ordenable: false,
      },
      {
        nombre: 'INVENTARIO',
        campoTipo: 'Booleano',
        visibleTabla: false,
        visibleFiltro: true,
        ordenable: false,
      },
      {
        nombre: 'EXISTENCIA',
        campoTipo: 'IntegerField',
        visibleTabla: false,
        visibleFiltro: true,
        ordenable: false,
      },
      {
        nombre: 'DISPONIBLE',
        campoTipo: 'IntegerField',
        visibleTabla: false,
        visibleFiltro: true,
        ordenable: false,
      },
    ],
  },
  Resolucion: {
    modulo: 'general',
    modelo: 'resolucion',
    tipo: 'Administrador',
    datos: [
      {
        nombre: 'ID',
        campoTipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'PREFIJO',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'NUMERO',
        campoTipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'CONSECUTIVO_DESDE',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'CONSECUTIVO_HASTA',
        campoTipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'FECHA_DESDE',
        campoTipo: 'DateField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'FECHA_HASTA',
        campoTipo: 'DateField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'CLAVE_TECNICA',
        campoTipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'SET_PRUEBA',
        campoTipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: false,
      },
    ],
  },
  Factura: {
    modulo: 'general',
    modelo: 'factura',
    tipo: 'Movimiento',
    datos: [
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
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
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
        campoTipo: 'Booleano',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: false,
      },
      {
        nombre: 'ESTADO_ANULADO',
        campoTipo: 'Booleano',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: false,
      },
    ],
  },
  Precio: {
    modulo: 'general',
    modelo: 'precio',
    tipo: 'Administrador',
    datos: [
      {
        nombre: 'ID',
        campoTipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'NOMBRE',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: false,
      },
      {
        nombre: 'TIPO',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'FECHA_VENCE',
        campoTipo: 'DateField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: false,
      },
    ],
  },
  Asesor: {
    modulo: 'general',
    modelo: 'asesor',
    tipo: 'Administrador',
    datos: [
      {
        nombre: 'ID',
        campoTipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'NOMBRE_CORTO',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'CORREO',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
      {
        nombre: 'CELULAR',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: false,
      },
    ],
  },
};
