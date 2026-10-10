/* RLE and macrocell validation, independent of rendering. Conway B3/S23 only. */
(function (scope) {
  'use strict';
  const MAX_COORDINATE = 2 ** 50;
  function integer(value, label, max = MAX_COORDINATE) {
    if (!Number.isSafeInteger(value) || value < 0 || value > max) throw Error(label + ' no es un entero válido.');
    return value;
  }
  function conway(rule) {
    return !rule || ['B3/S23', '23/3', 'S23/B3', 'LIFE', 'CONWAYLIFE'].includes(rule.toUpperCase().replace(/\s/g, ''));
  }
  function parseRle(text, maxPopulation = 2000000) {
    const lines = text.replace(/\r/g, '').trim().split('\n');
    const headerIndex = lines.findIndex(line => /^\s*x\s*=/i.test(line));
    if (headerIndex < 0) throw Error('Falta la cabecera RLE: x = …, y = …, rule = B3/S23.');
    const header = /^\s*x\s*=\s*(\d+)\s*,\s*y\s*=\s*(\d+)(?:\s*,\s*rule\s*=\s*([^,]+))?\s*$/i.exec(lines[headerIndex]);
    if (!header) throw Error('La cabecera RLE no es válida.');
    const width = integer(Number(header[1]), 'La anchura');
    const height = integer(Number(header[2]), 'La altura');
    if (!conway(header[3])) throw Error('Este laboratorio utiliza la regla de Conway B3/S23.');
    const body = lines.slice(headerIndex + 1).filter(line => !line.trim().startsWith('#')).join('').replace(/\s/g, '');
    const xs = [], ys = [];
    let x = 0, y = 0, position = 0, ended = false;
    while (position < body.length) {
      let digits = '';
      while (/\d/.test(body[position] || 'x')) digits += body[position++];
      const count = digits ? integer(Number(digits), 'Una repetición') : 1;
      if (count === 0) throw Error('Las repeticiones deben ser positivas.');
      const token = body[position++];
      if (token === '!') {
        if (digits || position !== body.length) throw Error('El cierre RLE debe ser el último símbolo.');
        ended = true; break;
      }
      if (token === '$') {
        y += count; x = 0;
        if (y > height) throw Error('El patrón supera la altura declarada.');
      } else if (token === 'b' || token === 'o') {
        if (x + count > width || y >= height) throw Error('El patrón supera sus dimensiones declaradas.');
        if (token === 'o') {
          if (xs.length + count > maxPopulation) throw Error('Este RLE contiene demasiadas células para expandirlo. Importa un archivo macrocell (.mc) para estructuras mayores.');
          for (let i = 0; i < count; i++) { xs.push(x + i); ys.push(y); }
        }
        x += count;
      } else throw Error('Símbolo RLE no válido: ' + (token || 'fin del archivo'));
    }
    if (!ended) throw Error('El patrón RLE debe terminar con !.');
    const positionMatch = /#CXRLE\s+Pos=(-?\d+),(-?\d+)/i.exec(text);
    const offsetX = positionMatch ? Number(positionMatch[1]) : 0;
    const offsetY = positionMatch ? Number(positionMatch[2]) : 0;
    for (const value of [offsetX, offsetY]) if (!Number.isSafeInteger(value) || Math.abs(value) > MAX_COORDINATE) throw Error('La posición RLE está fuera de la precisión admitida.');
    const generationMatch = /#CXRLE[^\n]*\bGen=(\d+)/i.exec(text);
    const generation = generationMatch ? integer(Number(generationMatch[1]), 'La generación', Number.MAX_SAFE_INTEGER) : 0;
    return { xs: Float64Array.from(xs), ys: Float64Array.from(ys), width, height, offsetX, offsetY, generation };
  }
  function validateMacrocell(text) {
    const lines = text.replace(/\r/g, '').trim().split('\n');
    if (!lines[0].startsWith('[M2]')) throw Error('El archivo macrocell debe comenzar por [M2].');
    const levels = [0];
    for (const raw of lines.slice(1)) {
      const line = raw.trim();
      if (!line) continue;
      if (line.startsWith('#')) {
        if (/^#R\s/i.test(line) && !conway(line.slice(3))) throw Error('La regla macrocell debe ser B3/S23.');
        continue;
      }
      if (/^[.*$]+$/.test(line)) {
        const rows = line.split('$');
        if (rows.length > 9 || rows.slice(0, 8).some(row => row.length > 8) || (rows.length === 9 && rows[8])) throw Error('Una hoja macrocell debe caber en 8 × 8.');
        levels.push(3);
      } else {
        if (!/^\d+(?:\s+\d+){4}$/.test(line)) throw Error('Nodo macrocell no válido.');
        const parts = line.split(/\s+/).map(Number), level = parts[0];
        if (!Number.isInteger(level) || level < 4 || level > 53) throw Error('Nivel macrocell fuera de la precisión admitida.');
        for (const child of parts.slice(1)) if (child >= levels.length || (child !== 0 && levels[child] !== level - 1)) throw Error('Referencia macrocell incompatible.');
        levels.push(level);
      }
    }
    if (levels.length === 1) throw Error('El macrocell no contiene ningún nodo.');
    return true;
  }
  scope.LifeIO = { parseRle, validateMacrocell, conway, MAX_COORDINATE };
  if (typeof module !== 'undefined') module.exports = scope.LifeIO;
})(globalThis);
