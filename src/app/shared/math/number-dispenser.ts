export class NumberDispenser {
  private _id: number;

  constructor() {
    this._id = 0;
  }

  next(): number {
    this._id++;
    return this._id;
  }
}
