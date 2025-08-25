# Cookie Guard

Este módulo proporciona un sistema de guardias para verificar la existencia de cookies requeridas en la aplicación.

## Características

- Verificación de cookies requeridas para acceder a rutas protegidas
- Configuración dinámica de cookies requeridas
- Redirección automática al login cuando faltan cookies esenciales
- Notificación de cambios en el estado de las cookies mediante Observables

## Uso

### En módulos de rutas

```typescript
import { Routes } from '@angular/router';
import { cookieRequiredGuard } from '@core/guards';

export const routes: Routes = [
  {
    path: 'ruta-protegida',
    component: ComponenteProtegido,
    canActivate: [cookieRequiredGuard]
  }
];
```

### Configuración personalizada

```typescript
import { CookieGuardService } from '@core/guards';
import { cookieKey } from '@comun/services/domain/enums/cookie-key.enum';

@Component({...})
export class AppComponent implements OnInit {
  constructor(private cookieGuardService: CookieGuardService) {}

  ngOnInit() {
    // Configurar cookies requeridas personalizadas
    this.cookieGuardService.establecerCookiesRequeridas([
      { key: cookieKey.ACCESS_TOKEN, redirectOnMissing: true },
      { key: cookieKey.USUARIO, redirectOnMissing: true },
      { key: cookieKey.EMPRESA, redirectOnMissing: false } // No redirige si falta
    ]);
    
    // Agregar una nueva cookie requerida
    this.cookieGuardService.agregarCookieRequerida({
      key: cookieKey.CONFIGURACION,
      redirectOnMissing: true,
      errorMessage: 'Configuración no encontrada'
    });
  }
}
```
