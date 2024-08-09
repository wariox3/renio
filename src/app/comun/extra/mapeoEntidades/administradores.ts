type Mapeo = {
  [key: string]: {
    modulo:
      | 'compra'
      | 'venta'
      | 'contabilidad'
      | 'cartera'
      | 'humano'
      | 'inventario'
      | 'general';
    modelo: string;
    tipo: 'Administrador' | 'Movimiento';
    datos: {
      nombre: string;
      nombreAbreviado?: string;
      visibleTabla: boolean;
      visibleFiltro: boolean;
      ordenable: boolean;
      esFk?: boolean;
      modeloFk?: string;
      aplicaFormatoNumerico?: boolean;
      alinearAlaIzquierda?: boolean;
      campoTipo:
        | 'IntegerField'
        | 'FloatField'
        | 'CharField'
        | 'DateField'
        | 'Booleano'
        | 'Porcentaje'
        | 'Fk';
    }[];
  };
};

export const mapeo: Mapeo = {
  GenContacto: {
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
  GenItem: {
    modulo: 'general',
    modelo: 'Item',
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
  GenResolucion: {
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
  GenPrecio: {
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
  GenAsesor: {
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
  GenSede: {
    modulo: 'general',
    modelo: 'sede',
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
    ],
  },
  HumContrato: {
    modulo: 'humano',
    modelo: 'HumContrato',
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
        nombre: 'CONTRATO_TIPO_NOMBRE',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: true,
      },
      {
        nombre: 'CONTACTO_ID',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: true,
      },
      {
        nombre: 'CONTACTO_NUMERO_IDENTIFICACION',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: true,
      },
      {
        nombre: 'CONTACTO_NOMBRE_CORTO',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: true,
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
        nombre: 'CONTRATO_TIPO',
        campoTipo: 'CharField',
        visibleTabla: false,
        visibleFiltro: false,
        ordenable: true,
      },
      {
        nombre: 'GRUPO_NOMBRE',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: true,
      },
      {
        nombre: 'ESTADO_TERMINADO',
        nombreAbreviado: 'ESTADO_TERMINADO_ABREVIATURA',
        campoTipo: 'Booleano',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: false,
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
    ],
  },
  HumConcepto: {
    modulo: 'humano',
    modelo: 'HumConcepto',
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
        nombre: 'PORCENTAJE',
        campoTipo: 'Porcentaje',
        aplicaFormatoNumerico: true,
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: true,
      },
      {
        nombre: 'INGRESO_BASE_COTIZACION',
        campoTipo: 'Booleano',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: true,
      },
      {
        nombre: 'INGRESO_BASE_PRESTACION',
        campoTipo: 'Booleano',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: true,
      },
      {
        nombre: 'ORDEN',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: false,
        ordenable: true,
      },
    ],
  },
  HumGrupo: {
    modulo: 'humano',
    modelo: 'HumGrupo',
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
    ],
  },
  GenCuentaBanco: {
    modulo: 'general',
    modelo: 'CuentaBanco',
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
        nombre: 'CUENTA_BANCO_TIPO_NOMBRE',
        campoTipo: 'Fk',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: false,
        esFk: true,
        modeloFk: 'CUENTA_BANCO',
      },
      {
        nombre: 'NOMBRE',
        campoTipo: 'CharField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
      },
      {
        nombre: 'NUMERO_CUENTA',
        campoTipo: 'IntegerField',
        visibleTabla: true,
        visibleFiltro: true,
        ordenable: true,
        alinearAlaIzquierda: true,
      },
    ],
  },
  ConCuenta: {
    modulo: 'contabilidad',
    modelo: 'ConCuenta',
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
        nombre: 'CODIGO',
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
    ],
  },
  ConComprobante: {
    modulo: 'contabilidad',
    modelo: 'ConComprobante',
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
    ],
  },
  ConGrupo: {
    modulo: 'contabilidad',
    modelo: 'ConGrupo',
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
    ],
  },
  InvAlmacen: {
    modulo: 'inventario',
    modelo: 'InvAlamacen',
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
    ],
  },
};
