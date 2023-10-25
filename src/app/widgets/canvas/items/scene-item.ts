import { CanvasItem } from "./canvas-item";

export class SceneItem extends CanvasItem {
  private _items: CanvasItem[];

  constructor() {
    super();
    this._items = [];
  }

  addItem(item: CanvasItem) {
    this._items.push(item);
  }

  addItems(items: CanvasItem[]) {
    for(let item of items) {
      this.addItem(item);
    }
  }

  clearItems() {
    this._items = [];
  }

  override draw(context: CanvasRenderingContext2D): void {
    this._items.forEach((item: CanvasItem) => {item.draw(context)});
  }
}
