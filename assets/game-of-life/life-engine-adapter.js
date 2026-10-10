/* BSD engine adapter: preserve exact coordinates beyond the upstream 32-bit bulk loader. */
'use strict';
LifeUniverse.prototype.partition = function (start, end, test, other, offset) {
  let i = start, j = end;
  const bit = value => Math.floor(value / offset) % 2;
  while (i <= j) {
    while (i <= end && bit(test[i]) === 0) i++;
    while (j > start && bit(test[j]) === 1) j--;
    if (i >= j) break;
    [test[i], test[j]] = [test[j], test[i]];
    [other[i], other[j]] = [other[j], other[i]];
    i++; j--;
  }
  return i;
};
LifeUniverse.prototype.setup_field_recurse = function (start, end, xs, ys, level) {
  if (start > end) return this.empty_tree(level);
  if (level === 2) return this.level2_setup(start, end, xs, ys);
  const next = level - 1, offset = this.pow2(next);
  const south = this.partition(start, end, ys, xs, offset);
  const northEast = this.partition(start, south - 1, xs, ys, offset);
  const southEast = this.partition(south, end, xs, ys, offset);
  return this.create_tree(
    this.setup_field_recurse(start, northEast - 1, xs, ys, next),
    this.setup_field_recurse(northEast, south - 1, xs, ys, next),
    this.setup_field_recurse(south, southEast - 1, xs, ys, next),
    this.setup_field_recurse(southEast, end, xs, ys, next),
  );
};

// Avoid rounding log2(2^n + 1) down at large exact integer coordinates.
LifeUniverse.prototype.get_level_from_bounds = function (bounds) {
  let maximum = 4;
  for (const value of Object.values(bounds)) maximum = Math.max(maximum, value >= 0 ? value + 1 : -value);
  let level = 0, size = 1;
  while (size < maximum) { size *= 2; level++; }
  return level + 1;
};
