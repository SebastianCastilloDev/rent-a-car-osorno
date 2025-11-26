/**
 * Valida un RUT chileno
 * @param rut RUT completo con o sin formato
 * @returns true si el RUT es válido
 */
export function validarRUT(rut: string): boolean {
  if (!rut) return false;

  // Limpiar RUT
  const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();

  // Verificar formato básico
  if (!/^\d{7,8}[0-9K]$/.test(rutLimpio)) {
    return false;
  }

  const dv = rutLimpio.slice(-1);
  const numero = rutLimpio.slice(0, -1);

  // Calcular dígito verificador
  let suma = 0;
  let multiplicador = 2;

  for (let i = numero.length - 1; i >= 0; i--) {
    suma += parseInt(numero[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dvCalculado = resto < 2 ? resto.toString() : (11 - resto).toString();

  if (dvCalculado === '10') {
    return dv === 'K';
  }

  return dv === dvCalculado;
}

/**
 * Valida una patente chilena
 * @param patente Patente a validar
 * @returns true si la patente es válida
 */
export function validarPatente(patente: string): boolean {
  if (!patente) return false;

  // Limpiar patente
  const patenteLimpia = patente.replace(/-/g, '').toUpperCase();

  // Formato antiguo: AA-BB-12 (6 caracteres)
  // Formato nuevo: AA-BB-CD (6 caracteres)
  const formatoAntiguo = /^[A-Z]{2}[A-Z]{2}\d{2}$/;
  const formatoNuevo = /^[A-Z]{2}[A-Z]{2}[A-Z]{2}$/;

  return formatoAntiguo.test(patenteLimpia) || formatoNuevo.test(patenteLimpia);
}

/**
 * Extrae el RUT sin formato
 * @param rut RUT con o sin formato
 * @returns RUT sin puntos ni guión
 */
export function limpiarRUT(rut: string): string {
  if (!rut) return '';
  return rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
}

/**
 * Extrae la patente sin formato
 * @param patente Patente con o sin formato
 * @returns Patente sin guiones y en mayúsculas
 */
export function limpiarPatente(patente: string): string {
  if (!patente) return '';
  return patente.replace(/-/g, '').toUpperCase();
}


