// complex-esm 2.1.1-esm1 ships declarations but its package "types" path is incorrect.
declare module 'complex-esm' {
  export { Complex } from 'complex-esm/dist/src/complex';
}
