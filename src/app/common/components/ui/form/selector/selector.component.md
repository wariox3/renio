# SelectorComponent (`<app-selector>`)

Componente selector unificado basado en `@ng-select/ng-select`. Carga opciones desde un endpoint API y soporta búsqueda local, búsqueda server-side con debounce, auto-selección, y validación con Reactive Forms.

## Importar

```typescript
import { SelectorComponent } from 'src/app/common/components/ui/form/selector/selector.component';

@Component({
  imports: [SelectorComponent],
})
```

---

## Uso básico

### Selector simple (lista estática desde API)

```html
<app-selector
  endpoint="contabilidad/activo_grupo/seleccionar/"
  [parametros]="{ limit: 100 }"
  labelField="nombre"
  valueField="id"
  [control]="formulario.get('activo_grupo')">
</app-selector>
```

### Selector con búsqueda server-side

Definir `searchField` activa la búsqueda remota. Cada tecleo envía una consulta al endpoint con ese campo como filtro (con debounce de 300ms por defecto).

```html
<app-selector
  endpoint="general/resolucion/seleccionar/"
  [parametros]="{ venta: 'True' }"
  labelField="numero"
  valueField="id"
  searchField="numero__icontains"
  [control]="formulario.get('resolucion')"
  (selectionChange)="onResolucionSeleccionada($event)">
</app-selector>
```

### Selector con auto-selección del primer valor

Útil para formularios de creación donde se quiere un valor por defecto.
En modo edición (`isEdicion=true`), la auto-selección se desactiva.

```html
<app-selector
  endpoint="contabilidad/metodo_depreciacion/seleccionar/"
  [parametros]="{ limite: 100 }"
  labelField="nombre"
  valueField="id"
  [sugerirPrimerValor]="true"
  [isEdicion]="!!detalle"
  [control]="formulario.get('metodo_depreciacion')"
  (selectionChange)="onMetodoChange($event)">
</app-selector>
```

### Selector con label personalizado

```html
<app-selector
  endpoint="general/contacto/seleccionar/"
  [parametros]="{ limit: 50 }"
  valueField="id"
  [formatoCustomLabel]="formatoContacto"
  [control]="formulario.get('contacto')">
</app-selector>
```

```typescript
// En el componente padre:
formatoContacto = (item: any) => `${item.numero_identificacion} - ${item.nombre_corto}`;
```

### Selector con validación y mensajes de error

```html
<app-selector
  endpoint="humano/tipo_costo/seleccionar/"
  [parametros]="{ limit: 100 }"
  [control]="formulario.get('tipo_costo')"
  [errors]="{ required: 'Debe seleccionar un tipo de costo' }">
</app-selector>
```

---

## API — Inputs

### Configuración de datos

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `endpoint` | `string` | **(requerido)** | Ruta del API. Ej: `'contabilidad/activo_grupo/seleccionar/'` |
| `parametros` | `Record<string, any>` | `{}` | Parámetros adicionales para la consulta API. Ej: `{ limit: 100 }` o `{ compra: 'True' }` |
| `labelField` | `string` | `'nombre'` | Campo del objeto a mostrar como texto de la opción |
| `valueField` | `string` | `'id'` | Campo del objeto a usar como valor seleccionado |
| `searchField` | `string` | `''` | Campo para búsqueda server-side. Si está vacío, la búsqueda es local. Ej: `'numero__icontains'` |

### Configuración de UX

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `placeholder` | `string` | `''` | Texto placeholder cuando no hay selección |
| `notFoundText` | `string` | `'Sin elementos'` | Texto cuando no hay resultados |
| `clearable` | `boolean` | `true` | Muestra botón X para limpiar selección |
| `appendTo` | `string \| null` | `null` | Dónde se adjunta el dropdown en el DOM. `null` usa el contenedor por defecto, `'body'` lo adjunta al body |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño visual del componente |
| `debounceTime` | `number` | `300` | Milisegundos de espera antes de buscar (server-side) |

### Comportamiento

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `sugerirPrimerValor` | `boolean` | `false` | Auto-selecciona el primer item al cargar datos |
| `isEdicion` | `boolean` | `false` | Si `true`, desactiva `sugerirPrimerValor` |
| `formatoCustomLabel` | `(item: any) => string` | — | Función para personalizar el texto de cada opción |

### Validación

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `control` | `AbstractControl` | — | Referencia al control reactivo del formulario |
| `errors` | `{ [key: string]: string }` | `{}` | Mapa de mensajes de error personalizados |
| `invalid` | `boolean` | `false` | Flag manual de invalidez (si no se usa `control`) |
| `dirty` | `boolean` | `false` | Flag manual de dirty (si no se usa `control`) |
| `touched` | `boolean` | `false` | Flag manual de touched (si no se usa `control`) |

---

## API — Outputs

| Output | Tipo emitido | Descripción |
|--------|-------------|-------------|
| `selectionChange` | `any \| null` | Emite el **objeto completo** del item seleccionado. Emite `null` al limpiar. |

---

## ControlValueAccessor

El componente implementa `ControlValueAccessor`, lo que permite usarlo con `formControlName` o `ngModel`:

```html
<!-- Con formControlName (el valor que se guarda es el valueField, por defecto 'id') -->
<app-selector formControlName="grupo" endpoint="..." ></app-selector>

<!-- Con [control] (patrón usado en este proyecto) -->
<app-selector [control]="formulario.get('grupo')" endpoint="..." ></app-selector>
```

**Nota:** Cuando se usa `[control]`, el componente sincroniza automáticamente el valor entre el control y el selector.

---

## Búsqueda local vs server-side

| `searchField` | Comportamiento |
|---------------|---------------|
| `''` (vacío) | Búsqueda **local**: ng-select filtra las opciones ya cargadas por `labelField` |
| `'campo__icontains'` | Búsqueda **server-side**: cada tecleo (con debounce) envía `endpoint?campo__icontains=texto` |

---

## Recarga dinámica

Si `endpoint` o `parametros` cambian después del init (por ejemplo, filtros que dependen de otro campo), el componente recarga automáticamente los datos.

```html
<!-- parametros cambia cuando el usuario selecciona un tipo de documento -->
<app-selector
  endpoint="general/resolucion/seleccionar/"
  [parametros]="filtrosResolucion"
  ...>
</app-selector>
```

```typescript
// En el componente padre:
onTipoDocumentoChange(tipo: string) {
  this.filtrosResolucion = { tipo_documento: tipo };
  // El selector recarga automáticamente
}
```

---

## Respuesta del API

El componente soporta dos formatos de respuesta:

```json
// Formato 1: Array directo
[{ "id": 1, "nombre": "Opción A" }, { "id": 2, "nombre": "Opción B" }]

// Formato 2: Respuesta paginada (usa .results)
{ "count": 2, "results": [{ "id": 1, "nombre": "Opción A" }, ...] }
```

---

## Ejemplo completo de migración

### Antes (selector individual):

```html
<app-seleccionar-activo-grupo
  [valorInicial]="formulario.get('grupo')?.value"
  [sugerirPrimerValor]="true"
  [isEdicion]="isEdicion"
  (selectChange)="formulario.get('grupo')?.setValue($event)">
</app-seleccionar-activo-grupo>
```

### Después (selector unificado):

```html
<app-selector
  endpoint="contabilidad/activo_grupo/seleccionar/"
  [parametros]="{ limit: 100 }"
  labelField="nombre"
  valueField="id"
  [sugerirPrimerValor]="true"
  [isEdicion]="isEdicion"
  [control]="formulario.get('grupo')"
  (selectionChange)="onGrupoChange($event)">
</app-selector>
```

```typescript
onGrupoChange(item: any) {
  // item es el objeto completo: { id: 1, nombre: 'Grupo A' }
  // El control ya se actualiza automáticamente con el id
  // Usa este handler solo si necesitas datos adicionales del objeto
}
```

---

## Troubleshooting

### El selector no muestra nada

**Problema:** El componente no muestra el dropdown ni las opciones.

**Soluciones aplicadas:**

1. **Estilos de ng-select:** Verificar que en `src/styles.scss` esté importado:
   ```scss
   @import "~@ng-select/ng-select/themes/default.theme.css";
   ```

2. **appendTo configurado correctamente:** El valor por defecto es `null` (usa el contenedor padre). Si usas `'body'`, asegúrate de que los estilos globales estén cargados.

3. **searchable habilitado:** El template incluye `[searchable]="true"` para habilitar la búsqueda.

4. **Validación de datos:** El componente ahora valida que:
   - El endpoint esté definido
   - La respuesta sea un array válido
   - Los items tengan el campo `labelField` especificado

5. **Console logs:** Si el selector sigue sin funcionar, abre la consola del navegador (F12) y busca mensajes con el prefijo `[SelectorComponent]` que indican:
   - Si el endpoint está definido
   - Si la respuesta es válida
   - Errores en la carga de datos

### El selector no carga datos

Verifica en la consola del navegador:
- `[SelectorComponent] No se ha definido un endpoint` → Falta definir el input `endpoint`
- `[SelectorComponent] La respuesta no es un array` → El API no está retornando el formato esperado
- `[SelectorComponent] Error al cargar datos` → Problema de red o endpoint incorrecto

### La búsqueda no funciona

- **Búsqueda local:** Asegúrate de que los items tengan el campo especificado en `labelField`
- **Búsqueda server-side:** Define `searchField` con el nombre del parámetro de filtro del API (ej: `'nombre__icontains'`)
