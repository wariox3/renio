# Switches de Filtro Configurables - Componente BuscarAvanzado

## Descripción
El componente `BuscarAvanzadoComponent` ahora soporta switches de filtro configurables que permiten agregar controles de filtrado adicionales de manera reutilizable.

## Interfaz FiltroSwitchConfig

```typescript
export interface FiltroSwitchConfig {
  id: string;              // Identificador único del switch
  label: string;           // Texto que se muestra junto al switch
  checked: boolean;        // Estado inicial del switch
  parametroApi?: string;   // Parámetro que se enviará en la consulta API
  valorTrue?: any;         // Valor a enviar cuando el switch está activado
  valorFalse?: any;        // Valor a enviar cuando el switch está desactivado
  tooltip?: string;        // Tooltip opcional para el switch
}
```

## Uso Básico

### 1. En el componente TypeScript:

```typescript
import { FiltroSwitchConfig, FiltroSwitchEvent } from '@comun/interfaces/filtro-switch.interface';

export class MiComponente {
  public switchesConfig: FiltroSwitchConfig[] = [
    {
      id: 'activos-solo',
      label: 'Solo activos',
      checked: true,
      parametroApi: 'estado',
      valorTrue: 'activo',
      valorFalse: undefined, // No enviar parámetro
      tooltip: 'Mostrar solo registros activos'
    },
    {
      id: 'verificados',
      label: 'Verificados',
      checked: false,
      parametroApi: 'verificado',
      valorTrue: 'True',
      valorFalse: 'False'
    }
  ];

  onSwitchChange(evento: FiltroSwitchEvent) {
    console.log('Switch cambiado:', evento);
    // Manejar el cambio del switch
    if (evento.id === 'activos-solo') {
      // Lógica específica para este switch
    }
  }
}
```

### 2. En el template HTML:

```html
<app-comun-buscar-avanzado
  [consultarUrl]="'mi-endpoint/'"
  [tituloModal]="'Mi Entidad'"
  [campoLista]="misCampos"
  [campoFiltros]="misFiltros"
  [switchesConfig]="switchesConfig"
  (emitirCambioSwitch)="onSwitchChange($event)"
  (emitirRegistroSeleccionado)="onSeleccionar($event)"
>
</app-comun-buscar-avanzado>
```

## Características

- **Escalable**: Permite agregar múltiples switches sin modificar el componente base
- **Configurable**: Cada switch puede tener diferentes parámetros API y valores
- **Responsive**: Los switches se organizan en una grilla responsive
- **Tooltips**: Soporte para tooltips explicativos
- **Eventos**: Emite eventos cuando cambia el estado de los switches

## Ejemplo Completo - Contratos

```typescript
private _configurarSwitches() {
  if (this.mostrarToggleFiltro) {
    this.switchesConfigContrato = [
      {
        id: 'contratos-activos',
        label: 'Ver todos',
        checked: this.mostrarSoloActivos,
        parametroApi: 'estado_terminado',
        valorTrue: undefined, // No enviar parámetro cuando se muestran todos
        valorFalse: 'False', // Solo contratos activos
        tooltip: 'Alternar entre mostrar solo contratos activos o todos los contratos'
      }
    ];
  }
}
```

## Ventajas

1. **Reutilizable**: El mismo componente puede usarse en diferentes contextos
2. **Mantenible**: Cambios en la lógica de switches se centralizan
3. **Flexible**: Cada implementación puede definir sus propios switches
4. **Consistente**: UI uniforme en toda la aplicación
