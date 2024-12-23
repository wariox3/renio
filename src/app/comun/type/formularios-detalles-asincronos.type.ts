export type FormulariosYDetallesAsíncronos = {
  [key: number | string]: {
    detalle?: () => Promise<{ default: any }>;
    formulario?: () => Promise<{ default: any }>;
  };
};
