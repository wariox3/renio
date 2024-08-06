type FormulariosYDetallesAsíncronos = {
  [key: string]: {
    modulo?:
      | 'compra'
      | 'venta'
      | 'contabilidad'
      | 'cartera'
      | 'humano'
      | 'inventario'
      | 'general';
    modelo?: string;
    tipo?: string;
    detalle: () => Promise<{ default: any }>;
    formulario: () => Promise<{ default: any }>;
  };
};

export const Componetes: FormulariosYDetallesAsíncronos = {
  GenContacto: {
    modulo: 'general',
    modelo: 'contacto',
    detalle: async () =>
      await import(
        '../../../modules/general/componentes/contacto/contacto-detalle/contacto-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/componentes/contacto/contacto-formulario/contacto-formulario.component'
      ),
  },
  GenItem: {
    modulo: 'general',
    modelo: 'item',
    detalle: async () =>
      await import(
        '../../../modules/general/componentes/item/item-detalle/item-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/componentes/item/item-formulario/item-formulario.component'
      ),
  },
  GenResolucion: {
    modulo: 'general',
    modelo: 'resolucion',
    tipo: 'Administrador',
    detalle: async () =>
      await import(
        '../../../modules/general/componentes/resolucion/resolucion-detalle/resolucion-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/componentes/resolucion/resolucion-formulario/resolucion-formulario.component'
      ),
  },
  GenPrecio: {
    modulo: 'general',
    modelo: 'precio',
    detalle: async () =>
      await import(
        '../../../modules/general/componentes/precio/precio-detalle/precio-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/componentes/precio/precio-formulario/precio-formulario.component'
      ),
  },
  GenAsesor: {
    modulo: 'general',
    modelo: 'asesor',
    detalle: async () =>
      await import(
        '../../../modules/general/componentes/asesor/asesor-detalle/asesor-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/componentes/asesor/asesor-formulario/asesor-formulario.component'
      ),
  },
  GenEmpleado: {
    modulo: 'humano',
    modelo: 'contacto',
    detalle: async () =>
      await import(
        '../../../modules/humano/componentes/administrador/empleado/empleado-detalle/empleado-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/componentes/administrador/empleado/empleado-formulario/empleado-formulario.component'
      ),
  },
  HumContrato: {
    modulo: 'humano',
    modelo: 'HumContrato',
    detalle: async () =>
      await import(
        '../../../modules/humano/componentes/administrador/contrato/contrato-detalle/contrato-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/componentes/administrador/contrato/contrato-formulario/contrato-formulario.component'
      ),
  },
  HumGrupo: {
    modulo: 'humano',
    modelo: 'HumGrupo',
    detalle: async () =>
      await import(
        '../../../modules/humano/componentes/administrador/grupo/grupo-detalle/grupo-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/componentes/administrador/grupo/grupo-formulario/grupo-formulario.component'
      ),
  },
  HumConcepto: {
    modulo: 'humano',
    modelo: 'HumConcepto',
    detalle: async () =>
      await import(
        '../../../modules/humano/componentes/administrador/concepto/concepto-detalle/concepto-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/componentes/administrador/concepto/concepto-formulario/concepto-formulario.component'
      ),
  },
  GenSede: {
    modulo: 'general',
    modelo: 'sede',
    detalle: async () =>
      await import(
        '../../../modules/general/componentes/sede/sede-detalle/sede-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/componentes/sede/sede-formulario/sede-formulario.component'
      ),
  },
  GenCuentaBanco: {
    modulo: 'general',
    modelo: 'CuentaBanco',
    detalle: async () =>
      await import(
        '../../../modules/general/componentes/cuenta-banco/cuenta-banco-detalle/cuenta-banco-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/componentes/cuenta-banco/cuenta-banco-formulario/cuenta-banco-formulario.component'
      ),
  },
  ConCuenta: {
    modulo: 'contabilidad',
    modelo: 'ConCuenta',
    detalle: async () =>
      await import(
        '../../../modules/contabilidad/componentes/administrador/cuenta/cuenta-detalle/cuenta-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/contabilidad/componentes/administrador/cuenta/cuenta-formulario/cuenta-formulario.component'
      ),
  },
  ConComprobante: {
    modulo: 'contabilidad',
    modelo: 'ConComprobante',
    detalle: async () =>
      await import(
        '../../../modules/contabilidad/componentes/administrador/comprobante/comprobante-detalle/comprobante-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/contabilidad/componentes/administrador/comprobante/comprobante-formulario/comprobante-formulario.component'
      ),
  },
  InvAlmacen: {
    modulo: 'inventario',
    modelo: 'InvAlmacen',
    detalle: async () =>
      await import(
        '../../../modules/inventario/componentes/administrador/almacen/almacen-detalle/almacen-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/inventario/componentes/administrador/almacen/almacen-formulario/almacen-formulario.component'
      ),
  },
};
