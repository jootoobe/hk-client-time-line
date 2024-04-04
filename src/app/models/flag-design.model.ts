export class FlagDesignModel {
  constructor(
    public color_text: string,
    public color_nets: [{background: string, text: string}],
    public color_transparency: string,
    public color_hex: string,
    public color_rgb: string,
    public color_hsl: string,
  ) { }
}
