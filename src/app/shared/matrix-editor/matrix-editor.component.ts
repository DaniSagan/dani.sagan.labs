import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector:'app-matrix-editor',standalone:true,imports:[CommonModule,FormsModule],
  templateUrl:'./matrix-editor.component.html',styleUrls:['./matrix-editor.component.css']
})
export class MatrixEditorComponent implements OnChanges {
  @Input() value='';
  @Output() valueChange=new EventEmitter<string>();
  readonly sizes=[1,2,3,4,5,6];
  cells:string[][]=[['1','0','0'],['0','1','0']];
  rows=2;columns=2;importText='';error='';private emitted?:string;
  ngOnChanges():void{if(this.value===this.emitted)return;this.importText=this.value;this.load(this.value,false);}
  trackIndex(index:number):number{return index;}
  columnWidth(column:number):string{return `${Math.min(26,Math.max(6,...this.cells.map(r=>(r[column]||'').length+1)))}ch`;}
  edit(row:number,column:number,value:string):void{this.cells[row][column]=value;this.publish();}
  resize():void{
    const old=this.cells,oldColumns=old[0].length-1;
    this.cells=Array.from({length:this.rows},(_,i)=>[...Array.from({length:this.columns},(_,j)=>j<oldColumns?(old[i]?.[j]??'0'):'0'),old[i]?.[oldColumns]??'0']);
    this.publish();
  }
  private publish():void{
    this.error='';this.emitted=this.cells.map(r=>r.map(s=>s.replace(/\s/g,'')||'?').join(' ')).join('\n');this.importText=this.emitted;this.valueChange.emit(this.emitted);
  }
  load(text:string,emit=true):void{
    if(text.length>7000){this.error='Máximo 7000 caracteres.';return;}
    const cells=text.trim().split(/\n|;/).map(r=>r.trim().split(/[\s,\t]+/));
    if(cells.length>6||cells[0].length<2||cells[0].length>7||cells.some(r=>r.length!==cells[0].length)){
      this.error='Introduce una matriz rectangular de 1 a 6 filas, con los coeficientes y la columna b.';return;
    }
    this.cells=cells;this.rows=cells.length;this.columns=cells[0].length-1;this.error='';if(emit)this.publish();
  }
  paste(event:ClipboardEvent):void{
    const text=event.clipboardData?.getData('text')||'';
    if(!/[\n\t;,]|\S\s+\S/.test(text))return;
    event.preventDefault();this.importText=text;this.load(text);
  }
  navigate(event:KeyboardEvent,row:number,column:number):void{
    let nextRow=row,nextColumn=column;
    if(event.key==='ArrowUp')nextRow--;else if(event.key==='ArrowDown')nextRow++;
    else if(event.key==='Enter'){nextColumn++;if(nextColumn>this.columns){nextColumn=0;nextRow++;}}
    else if(event.ctrlKey&&event.key==='ArrowLeft')nextColumn--;
    else if(event.ctrlKey&&event.key==='ArrowRight')nextColumn++;else return;
    if(nextRow<0||nextRow>=this.rows||nextColumn<0||nextColumn>this.columns)return;
    const input=event.target as HTMLInputElement;
    const target=input.closest('table')?.querySelector<HTMLInputElement>(`input[data-row="${nextRow}"][data-column="${nextColumn}"]`);
    if(target){event.preventDefault();target.focus();target.select();}
  }
}
