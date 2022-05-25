export interface Factor {
  base: number;
  exponent: number;
}

export function getFactors(value: number): Factor[] {
  let result: Factor[] = [];
  let currentValue = value;
  if(value < 2) return [{base: value, exponent: 1}];
  let factor: number = 2;
  while(currentValue > 1) {
    if(currentValue % factor === 0) {
      let foundFactor = result.find(e => e.base === factor);
      if(foundFactor) {
        foundFactor.exponent++;
      } else {
        result.push({base: factor, exponent: 1});
      }
      currentValue /= factor;
    } else {
      factor++;
    }
  }
  return result;
}

export function isPrime(value: number): boolean {
  if(value < 2) return false;
  else if(value === 2) return true;
  else if(value % 2 === 0) return false;
  else {
    for(let n: number = 3; n < Math.sqrt(value); n += 2) {
      if(value % n === 0) return false;
    }
    return true;
  }
}
