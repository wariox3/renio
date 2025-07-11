export interface campoBuscarAvanzada {
  name: string;
  displayName: string;
  type: 'string' | 'number' | 'date'; // Puedes añadir más tipos si es necesario
  aplicaFormatoNumerico?: boolean;
}
