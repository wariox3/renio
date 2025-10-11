export interface FiltroSwitchConfig {
  id: string;
  label: string;
  checked: boolean;
  parametroApi?: string; // Parámetro que se enviará en la consulta API
  valorTrue?: any; // Valor a enviar cuando el switch está activado
  valorFalse?: any; // Valor a enviar cuando el switch está desactivado
  tooltip?: string; // Tooltip opcional para el switch
}

export interface FiltroSwitchEvent {
  id: string;
  checked: boolean;
  parametroApi?: string;
  valor: any;
}
