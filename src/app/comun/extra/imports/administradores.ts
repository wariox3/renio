import { FormulariosDetalles } from '@comun/type/mapeo-formulario-detalle.type';

export const Componentes: Partial<FormulariosDetalles> = {
  GenContacto: {
    modulo: 'general',
    modelo: 'contacto',
    detalle: async () =>
      await import(
        '../../../modules/general/paginas/contacto/contacto-detalle/contacto-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/paginas/contacto/contacto-formulario/contacto-formulario.component'
      ),
  },
  GenItem: {
    modulo: 'general',
    modelo: 'item',
    detalle: async () =>
      await import(
        '../../../modules/general/paginas/item/item-detalle/item-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/paginas/item/item-formulario/item-formulario.component'
      ),
  },
  GenResolucion: {
    modulo: 'general',
    modelo: 'resolucion',
    tipo: 'administrador',
    detalle: async () =>
      await import(
        '../../../modules/general/paginas/resolucion/resolucion-detalle/resolucion-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/paginas/resolucion/resolucion-formulario/resolucion-formulario.component'
      ),
  },
  GenPrecio: {
    modulo: 'general',
    modelo: 'precio',
    detalle: async () =>
      await import(
        '../../../modules/general/paginas/precio/precio-detalle/precio-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/paginas/precio/precio-formulario/precio-formulario.component'
      ),
  },
  GenAsesor: {
    modulo: 'general',
    modelo: 'asesor',
    detalle: async () =>
      await import(
        '../../../modules/general/paginas/asesor/asesor-detalle/asesor-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/paginas/asesor/asesor-formulario/asesor-formulario.component'
      ),
  },
  GenEmpleado: {
    modulo: 'humano',
    modelo: 'contacto',
    detalle: async () =>
      await import(
        '../../../modules/humano/paginas/administrador/empleado/empleado-detalle/empleado-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/paginas/administrador/empleado/empleado-formulario/empleado-formulario.component'
      ),
  },
  HumContrato: {
    modulo: 'humano',
    modelo: 'HumContrato',
    detalle: async () =>
      await import(
        '../../../modules/humano/paginas/administrador/contrato/contrato-detalle/contrato-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/paginas/administrador/contrato/contrato-formulario/contrato-formulario.component'
      ),
  },
  HumGrupo: {
    modulo: 'humano',
    modelo: 'HumGrupo',
    detalle: async () =>
      await import(
        '../../../modules/humano/paginas/administrador/grupo/grupo-detalle/grupo-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/paginas/administrador/grupo/grupo-formulario/grupo-formulario.component'
      ),
  },
  HumConcepto: {
    modulo: 'humano',
    modelo: 'HumConcepto',
    detalle: async () =>
      await import(
        '../../../modules/humano/paginas/administrador/concepto/concepto-detalle/concepto-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/paginas/administrador/concepto/concepto-formulario/concepto-formulario.component'
      ),
  },
  HumCargo: {
    modulo: 'humano',
    modelo: 'HumCargo',
    detalle: async () =>
      await import(
        '../../../modules/humano/paginas/administrador/cargo/cargo-detalle/cargo-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/paginas/administrador/cargo/cargo-formulario/cargo-formulario.component'
      ),
  },
  HumSucursal: {
    modulo: 'humano',
    modelo: 'HumSucural',
    detalle: async () =>
      await import(
        '../../../modules/humano/paginas/administrador/sucursal/sucursal-detalle/sucursal-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/paginas/administrador/sucursal/sucursal-formulario/sucursal-formulario.component'
      ),
  },
  GenSede: {
    modulo: 'general',
    modelo: 'sede',
    detalle: async () =>
      await import(
        '../../../modules/general/paginas/sede/sede-detalle/sede-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/paginas/sede/sede-formulario/sede-formulario.component'
      ),
  },
  GenCuentaBanco: {
    modulo: 'general',
    modelo: 'CuentaBanco',
    detalle: async () =>
      await import(
        '../../../modules/general/paginas/cuenta-banco/cuenta-banco-detalle/cuenta-banco-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/paginas/cuenta-banco/cuenta-banco-formulario/cuenta-banco-formulario.component'
      ),
  },
  ConCuenta: {
    modulo: 'contabilidad',
    modelo: 'ConCuenta',
    detalle: async () =>
      await import(
        '../../../modules/contabilidad/paginas/administrador/cuenta/cuenta-detalle/cuenta-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/contabilidad/paginas/administrador/cuenta/cuenta-formulario/cuenta-formulario.component'
      ),
  },
  ConActivo: {
    modulo: 'contabilidad',
    modelo: 'ConActivo',
    detalle: async () =>
      await import(
        '../../../modules/contabilidad/paginas/administrador/activo/activo-detalle/activo-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/contabilidad/paginas/administrador/activo/activo-formulario/activo-formulario.component'
      ),
  },
  ConComprobante: {
    modulo: 'contabilidad',
    modelo: 'ConComprobante',
    detalle: async () =>
      await import(
        '../../../modules/contabilidad/paginas/administrador/comprobante/comprobante-detalle/comprobante-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/contabilidad/paginas/administrador/comprobante/comprobante-formulario/comprobante-formulario.component'
      ),
  },
  ConGrupo: {
    modulo: 'contabilidad',
    modelo: 'ConGrupo',
    detalle: async () =>
      await import(
        '../../../modules/contabilidad/paginas/administrador/grupo/grupo-detalle/grupo-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/contabilidad/paginas/administrador/grupo/grupo-formulario/grupo-formulario.component'
      ),
  },
  GenFormaPago: {
    modulo: 'general',
    modelo: 'GenFormaPago',
    detalle: async () =>
      await import(
        '../../../modules/general/paginas/forma-pago/forma-pago-detalle/forma-pago-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/paginas/forma-pago/forma-pago-formulario/forma-pago-formulario.component'
      ),
  },
  InvAlmacen: {
    modulo: 'inventario',
    modelo: 'InvAlmacen',
    detalle: async () =>
      await import(
        '../../../modules/inventario/paginas/administrador/almacen/almacen-detalle/almacen-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/inventario/paginas/administrador/almacen/almacen-formulario/almacen-formulario.component'
      ),
  },
  HumAdicional: {
    detalle: async () =>
      await import(
        '../../../modules/humano/paginas/documento/adicional/adicional-detalle/adicional-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/paginas/documento/adicional/adicional-formulario/adicional-formulario.component'
      ),
  },
  HumCredito: {
    detalle: async () =>
      await import(
        '../../../modules/humano/paginas/documento/credito/credito-detalle/credito-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/paginas/documento/credito/credito-formulario/credito-formulario.component'
      ),
  },
  HumNovedad: {
    detalle: async () =>
      await import(
        '../../../modules/humano/paginas/documento/novedad/novedad-detalle/novedad-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/paginas/documento/novedad/novedad-formulario/novedad-formulario.component'
      ),
  },
};
