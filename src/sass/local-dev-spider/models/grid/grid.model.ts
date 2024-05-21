export class GridModel {
  constructor(
    public color: string,
    public cols: number,
    public colspan: number,
    public rows: number,
    public text: string,
    public gutterSize: any,
    public rowspan?: number,
    public rowHeight?: any,
  ) {

  }

}
