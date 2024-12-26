import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerStrategy, ErrorInformacion } from './http-error.interface';
import {
  InternalServerErrorStrategy,
  MethodNotAllowedStrategy,
  NotFoundStrategy,
  UnauthorizedStrategy,
} from './strategies/error.strategy';
import { BadRequestStrategy } from './strategies/bad-request.strategy';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  private _strategies = new Map<number, ErrorHandlerStrategy>();

  constructor() {
    this._initializeStrategies();
  }

  manejarError(error: HttpErrorResponse): ErrorInformacion {
    const strategy = this._strategies.get(error.status);

    // pasamos el error a su manejador
    if (strategy) {
      return strategy.handle(error);
    }

    // Fallback por si un error desconocido ocurre
    return {
      statusCode: error.status,
      mensaje: 'Ocurrió un error desconocido.',
    };
  }

  private _initializeStrategies(): void {
    this._strategies.set(400, new BadRequestStrategy());
    this._strategies.set(401, new UnauthorizedStrategy());
    this._strategies.set(404, new NotFoundStrategy());
    this._strategies.set(405, new MethodNotAllowedStrategy());
    this._strategies.set(500, new InternalServerErrorStrategy());
  }
}
