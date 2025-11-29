// Mock liviano de @nestjs/swagger para pruebas e2e
// Evita cargar dependencias internas de Nest que no son necesarias en Jest.

// Decoradores simples que no hacen nada en tiempo de ejecución.
export const ApiTags = (..._args: unknown[]) => () => undefined;
export const ApiOperation = (..._args: unknown[]) => () => undefined;
export const ApiResponse = (..._args: unknown[]) => () => undefined;
export const ApiBearerAuth = (..._args: unknown[]) => () => undefined;
export const ApiQuery = (..._args: unknown[]) => () => undefined;

export const ApiProperty = (..._args: unknown[]) => () => undefined;
export const ApiPropertyOptional = (..._args: unknown[]) => () => undefined;

// Utilidades de tipos (se devuelven tal cual para no romper en tiempo de ejecución)
export const PartialType = (classRef: unknown): unknown => classRef;
export const PickType = (classRef: unknown, _keys: string[]): unknown =>
  classRef;
export const OmitType = (classRef: unknown, _keys: string[]): unknown =>
  classRef;

// Clases utilizadas solo en configuración de Swagger; se mockean mínimamente.
export class DocumentBuilder {
  addBearerAuth(): this {
    return this;
  }

  setTitle(_title: string): this {
    return this;
  }

  setDescription(_description: string): this {
    return this;
  }

  setVersion(_version: string): this {
    return this;
  }

  build(): unknown {
    return {};
  }
}

export class SwaggerModule {
  static createDocument(): unknown {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  static setup(): void {}
}


