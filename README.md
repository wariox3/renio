# Reddoc App

[![Angular Version](https://img.shields.io/badge/Angular-17-%23DD0031?logo=angular)](https://angular.io/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Reddoc App es un sistema ERP de facturación completo desarrollado con Angular 17 que simplifica la gestión financiera y operativa de tu negocio. Con una interfaz moderna basada en Metronic, ofrece todas las herramientas necesarias para administrar facturas, clientes, inventario y más.

## Requisitos previos

- Node.js v18+
- npm v9+
- Angular CLI v17+

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone git@github.com:wariox3/renio.git
   cd renio
   ```
2. Instalar las dependencias
   ```
   npm install --legacy-peer-deps
   ```

## Variables de entorno
Se debe configurar el archivo `environment.ts` dentro de la carpeta `/environments`
   ```
   export const environment = {
        production: false,
        URL_API_MUUP: 'http://reddocapi.online',
        URL_API_SUBDOMINIO: 'http://subdominio.reddocapi.online',
        EMPRESA_LOCALHOST: '',
        dominioApp: '.reddoc.online',
        dominioHttp: 'http',
        appVersion: 'v8.1.8',
        USERDATA_KEY: '',
        isMockEnabled: true,
        appThemeName: 'Metronic',
        appPurchaseUrl: 'https://1.envato.market/EA4JP',
        appHTMLIntegration:
        'https://preview.keenthemes.com/metronic8/demo1/documentation/base/helpers/flex-layouts.html',
        appPreviewUrl: 'https://preview.keenthemes.com/metronic8/angular/demo1',
        appPreviewAngularUrl:
        'https://preview.keenthemes.com/metronic8/angular/demo1',
        appPreviewDocsUrl: 'https://preview.keenthemes.com/metronic8/angular/docs',
        appPreviewChangelogUrl:
        'https://preview.keenthemes.com/metronic8/angular/docs/changelog',
        llavePublica: '',
        appDocumentacion: 'https://documentacion.reddoc.co/apps/documentacion/',
        sessionLifeTime: 24,
        turnstileSiteKey: ''
    };
   ```

## Ejecución
Servidor de desarrollo:

   ```bash
    ng serve
   ```

Abre http://localhost:4200 en tu navegador.

Build para producción:

   ```bash
    ng build
   ```

Los archivos compilados se guardarán en la carpeta `dist/`.
