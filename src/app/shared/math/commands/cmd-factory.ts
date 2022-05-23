import { CommandBase } from "./command-base";

export class CmdFactory {
  private _storage: Map<string, any>;

  constructor() {
    this._storage = new Map<string, any>();
  }

  register(name: string, type: any) {
    this._storage.set(name, type);
  }

  create(name: string): CommandBase {
    let cmdInstance: CommandBase = new (this._storage.get(name))();
    return cmdInstance;
  }
}
