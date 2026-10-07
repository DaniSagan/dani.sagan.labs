import { MatrixEditorComponent } from './matrix-editor.component';

describe('Matrix editor',()=>{
  it('preserves the independent term when adding or removing unknowns',()=>{
    const editor=new MatrixEditorComponent();editor.load('1 2 7;3 4 8');editor.columns=3;editor.resize();
    expect(editor.cells).toEqual([['1','2','0','7'],['3','4','0','8']]);editor.columns=1;editor.resize();
    expect(editor.cells).toEqual([['1','7'],['3','8']]);
  });
  it('imports tabular clipboard data and rejects ragged matrices without losing edits',()=>{
    const editor=new MatrixEditorComponent();editor.load('1\t2\t3\n4\t5\t6');expect(editor.rows).toBe(2);expect(editor.columns).toBe(2);
    const before=editor.cells;editor.load('1 2 3\n4 5');expect(editor.error).toBeTruthy();expect(editor.cells).toBe(before);
  });
  it('publishes expressions without changing the shape and preserves an empty cell for validation',()=>{
    const editor=new MatrixEditorComponent();let value='';editor.valueChange.subscribe(v=>value=v);editor.edit(0,0,'(t + 1)/2');expect(value).toContain('(t+1)/2');editor.edit(0,1,'');expect(value.split('\n')[0]).toBe('(t+1)/2 ? 0');
  });
});
