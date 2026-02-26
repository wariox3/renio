# InputComponent (`app-input`)

Componente de input reutilizable que implementa `ControlValueAccessor` para integración directa con Reactive Forms. Maneja internamente la visualización de errores de validación.

**Ubicación:** `src/app/common/components/ui/form/input/input.component.ts`

## Importación

```typescript
import { InputComponent } from 'src/app/common/components/ui/form/input/input.component';

@Component({
  standalone: true,
  imports: [InputComponent],
})
```

## Uso básico

### Con Reactive Forms (recomendado)

```html
<app-input
  type="email"
  placeholder="john@example.com"
  formControlName="email"
  [control]="form.controls['email']"
  [errors]="{
    required: ('FORMULARIOS.VALIDACIONES.COMUNES.REQUERIDO' | translate),
    pattern: ('FORMULARIOS.VALIDACIONES.COMUNES.TIPOCORREO' | translate),
  }"
></app-input>
```

### Con etiqueta traducida

```html
<app-input
  labelTranslate="FORMULARIOS.CAMPOS.COMUNES.NOMBRE"
  formControlName="nombre"
  [control]="form.controls['nombre']"
  [errors]="{
    required: ('FORMULARIOS.VALIDACIONES.COMUNES.REQUERIDO' | translate),
    minLength: ('FORMULARIOS.VALIDACIONES.COMUNES.CAMPOMINIMO' | translate) + ' 3',
  }"
></app-input>
```

### Con etiqueta de texto plano

```html
<app-input
  label="Correo electrónico"
  type="email"
  placeholder="ejemplo@correo.com"
  formControlName="correo"
  [control]="form.controls['correo']"
  [errors]="{
    required: 'Este campo es requerido',
    email: 'Ingrese un correo válido',
  }"
></app-input>
```

### Input de solo lectura

```html
<app-input
  label="Código"
  [readonly]="true"
  formControlName="codigo"
></app-input>
```

### Con clases CSS adicionales

```html
<app-input
  formControlName="email"
  [inputClass]="'bg-transparent'"
  [control]="form.controls['email']"
></app-input>
```

### Acceso programático (ViewChild)

```typescript
@ViewChild(InputComponent) inputRef: InputComponent;

ngAfterViewInit() {
  this.inputRef.focus();  // Hacer focus
  this.inputRef.select(); // Seleccionar texto
}
```

## API

### Inputs

| Propiedad | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `''` | Etiqueta en texto plano |
| `labelTranslate` | `string` | `undefined` | Clave de traducción para la etiqueta (prioridad sobre `label`) |
| `placeholder` | `string` | `''` | Texto placeholder |
| `type` | `string` | `'text'` | Tipo HTML: `text`, `email`, `password`, `number`, etc. |
| `autocomplete` | `string` | `'off'` | Atributo `autocomplete` del input |
| `errors` | `{ [key: string]: string }` | `{}` | Mapa de errores: clave del validador -> mensaje |
| `disabled` | `boolean` | `false` | Deshabilitar el input |
| `readonly` | `boolean` | `false` | Solo lectura |
| `autofocus` | `boolean` | `false` | Focus automático al renderizar |
| `inputClass` | `string \| string[] \| object` | `''` | Clases CSS adicionales (compatible con `ngClass`) |
| `control` | `AbstractControl \| null` | `null` | Referencia al control del formulario para validación automática |
| `invalid` | `boolean` | `false` | Estado inválido manual (alternativa a `control`) |
| `dirty` | `boolean` | `false` | Estado dirty manual (alternativa a `control`) |
| `touched` | `boolean` | `false` | Estado touched manual (alternativa a `control`) |

### Outputs

| Evento | Tipo | Descripción |
|---|---|---|
| `blurEvent` | `EventEmitter<void>` | Se emite cuando el input pierde el foco |

### Métodos públicos

| Método | Descripción |
|---|---|
| `focus()` | Hace focus en el input nativo |
| `select()` | Selecciona el texto del input |

## Manejo de errores

### Modo automático (recomendado): pasar `[control]`

Cuando se pasa la referencia al `AbstractControl`, el componente:
1. Detecta automáticamente si el campo es `invalid`, `dirty` o `touched`
2. Lee los errores activos del control
3. Muestra solo los mensajes correspondientes a los errores activos

```html
<app-input
  formControlName="email"
  [control]="form.controls['email']"
  [errors]="{
    required: 'Campo requerido',
    email: 'Correo inválido',
    minLength: 'Mínimo 3 caracteres',
  }"
></app-input>
```

### Modo manual: sin `[control]`

Si no se pasa `control`, se deben proporcionar los flags manualmente:

```html
<app-input
  [invalid]="campo.invalid"
  [dirty]="campo.dirty"
  [touched]="campo.touched"
  [errors]="{ required: 'Campo requerido' }"
></app-input>
```

### Normalización de claves de error

Angular usa claves en minúsculas (`minlength`, `maxlength`), pero es común escribirlas en camelCase. El componente normaliza automáticamente:

| Clave Angular | Clave en `[errors]` |
|---|---|
| `required` | `required` |
| `minlength` | `minLength` |
| `maxlength` | `maxLength` |
| `pattern` | `pattern` |
| `email` | `email` |

Para validadores custom, usa la misma clave que devuelve tu validador.

## Notas

- El componente es **standalone**, se importa directamente sin necesidad de módulos.
- Implementa `ControlValueAccessor`, por lo que funciona con `formControlName` y `[(ngModel)]`.
- Los errores solo se muestran cuando el campo ha sido tocado (`touched`) o modificado (`dirty`).
- Si necesitas aplicar directivas adicionales al `<input>` nativo (como transformar texto), considera extender este componente o usar un enfoque diferente.
