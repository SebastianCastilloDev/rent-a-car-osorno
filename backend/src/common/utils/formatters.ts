/**
 * Formatea un RUT chileno
 * @param rut RUT sin puntos ni guión
 * @returns RUT formateado (ej: 12.345.678-9)
 */
export function formatearRUT(rut: string): string {
  if (!rut) return '';

  // Remover puntos y guiones existentes
  const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');

  // Separar número y dígito verificador
  const dv = rutLimpio.slice(-1).toUpperCase();
  const numero = rutLimpio.slice(0, -1);

  // Formatear número con puntos
  const numeroFormateado = numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${numeroFormateado}-${dv}`;
}

/**
 * Formatea una patente chilena
 * @param patente Patente sin formato
 * @returns Patente formateada (ej: AA-BB-12)
 */
export function formatearPatente(patente: string): string {
  if (!patente) return '';

  // Remover guiones existentes y convertir a mayúsculas
  const patenteLimpia = patente.replace(/-/g, '').toUpperCase();

  // Formato: AA-BB-12 o AA-BB-CD
  if (patenteLimpia.length === 6) {
    return `${patenteLimpia.slice(0, 2)}-${patenteLimpia.slice(2, 4)}-${patenteLimpia.slice(4, 6)}`;
  }

  return patenteLimpia;
}

/**
 * Formatea un monto en pesos chilenos
 * @param monto Monto numérico
 * @returns Monto formateado (ej: $1.234.567)
 */
export function formatearMonto(monto: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(monto);
}

/**
 * Formatea una fecha en formato chileno
 * @param fecha Objeto Date
 * @returns Fecha formateada (ej: 26/11/2025)
 */
export function formatearFecha(fecha: Date): string {
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(fecha);
}
