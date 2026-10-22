import { describe, it, expect } from 'vitest';
import { toDateKey, addDays, fromDateKey, daysBetween, formatDateDisplay } from '../dates';

describe('toDateKey - Conversión de Date a YYYY-MM-DD', () => {
  it('Debe convertir una fecha al formato ISO local YYYY-MM-DD', () => {
    const date = new Date('2026-10-22T12:00:00');
    const key = toDateKey(date);

    expect(key).toBe('2026-10-22');
  });

  it('Debe manejar correctamente meses con un solo dígito', () => {
    const date = new Date(2026, 0, 5); // Enero es 0
    const key = toDateKey(date);

    expect(key).toBe('2026-01-05');
  });

  it('Debe manejar correctamente días con un solo dígito', () => {
    const date = new Date(2026, 9, 1); // Octubre es 9
    const key = toDateKey(date);

    expect(key).toBe('2026-10-01');
  });

  it('Debe ignorar la hora del día (usar fecha local)', () => {
    const morning = new Date(2026, 9, 22, 0, 0, 0);
    const evening = new Date(2026, 9, 22, 23, 59, 59);

    expect(toDateKey(morning)).toBe(toDateKey(evening));
  });
});

describe('addDays - Sumar días a una fecha', () => {
  it('Debe sumar días correctamente', () => {
    const date = new Date(2026, 9, 22); // Octubre 22
    const result = addDays(date, 5);

    expect(result.getDate()).toBe(27);
    expect(result.getMonth()).toBe(9); // Octubre (0-indexed)
    expect(result.getFullYear()).toBe(2026);
  });

  it('Debe manejar correctamente el cambio de mes', () => {
    const date = new Date(2026, 9, 31); // Octubre 31
    const result = addDays(date, 1);

    expect(result.getDate()).toBe(1);
    expect(result.getMonth()).toBe(10); // Noviembre
  });

  it('Debe manejar correctamente el cambio de año', () => {
    const date = new Date(2026, 11, 31); // Diciembre 31
    const result = addDays(date, 1);

    expect(result.getDate()).toBe(1);
    expect(result.getMonth()).toBe(0); // Enero
    expect(result.getFullYear()).toBe(2027);
  });

  it('Debe restar días correctamente con números negativos', () => {
    const date = new Date(2026, 9, 22); // Octubre 22
    const result = addDays(date, -5);

    expect(result.getDate()).toBe(17);
  });
});

describe('fromDateKey - Parsear YYYY-MM-DD a Date local', () => {
  it('Debe parsear correctamente una clave de fecha', () => {
    const dateKey = '2026-10-22';
    const date = fromDateKey(dateKey);

    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(9); // Octubre (0-indexed)
    expect(date.getDate()).toBe(22);
  });

  it('Debe manejar meses con un solo dígito', () => {
    const dateKey = '2026-01-05';
    const date = fromDateKey(dateKey);

    expect(date.getMonth()).toBe(0); // Enero
    expect(date.getDate()).toBe(5);
  });

  it('Debe manejar días con un solo dígito', () => {
    const dateKey = '2026-10-01';
    const date = fromDateKey(dateKey);

    expect(date.getDate()).toBe(1);
  });

  it('Debe crear la fecha en zona horaria local (no UTC)', () => {
    const dateKey = '2026-10-22';
    const date = fromDateKey(dateKey);

    // La hora debe ser 00:00:00 en zona local
    expect(date.getHours()).toBe(0);
    expect(date.getMinutes()).toBe(0);
    expect(date.getSeconds()).toBe(0);
  });
});

describe('daysBetween - Días calendario entre dos fechas', () => {
  it('Debe calcular días entre fechas del mismo mes', () => {
    const from = '2026-10-15';
    const to = '2026-10-22';

    const days = daysBetween(from, to);

    expect(days).toBe(7);
  });

  it('Debe calcular días entre fechas de diferentes meses', () => {
    const from = '2026-09-22';
    const to = '2026-10-22';

    const days = daysBetween(from, to);

    expect(days).toBe(30); // Septiembre tiene 30 días
  });

  it('Debe devolver negativo si "to" es anterior a "from"', () => {
    const from = '2026-10-22';
    const to = '2026-10-15';

    const days = daysBetween(from, to);

    expect(days).toBe(-7);
  });

  it('Debe devolver 0 si las fechas son iguales', () => {
    const date = '2026-10-22';

    const days = daysBetween(date, date);

    expect(days).toBe(0);
  });

  it('Debe manejar correctamente años bisiestos', () => {
    const from = '2024-02-28';
    const to = '2024-03-01';

    const days = daysBetween(from, to);

    expect(days).toBe(2); // 28 feb + 29 feb (bisiesto)
  });

  it('Debe manejar años no bisiestos', () => {
    const from = '2023-02-28';
    const to = '2023-03-01';

    const days = daysBetween(from, to);

    expect(days).toBe(1); // 28 feb → 1 mar (no bisiesto)
  });
});

describe('formatDateDisplay - Formato DD-MM-YYYY', () => {
  it('Debe formatear una clave de fecha al formato chileno', () => {
    const dateKey = '2026-10-22';
    const display = formatDateDisplay(dateKey);

    expect(display).toBe('22-10-2026');
  });

  it('Debe manejar meses con un solo dígito', () => {
    const dateKey = '2026-01-05';
    const display = formatDateDisplay(dateKey);

    expect(display).toBe('05-01-2026');
  });

  it('Debe manejar días con un solo dígito', () => {
    const dateKey = '2026-10-01';
    const display = formatDateDisplay(dateKey);

    expect(display).toBe('01-10-2026');
  });
});
