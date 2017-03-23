/**
 * config stuff
 */
export default class Config {
  static SELECTION_CONFIG:SelectionConfig;
}
class SelectionConfig {
  public Stroke:boolean = true;
  public StrokeWidth:number = 2;
  public StrokeColor:string = "rgba(0; 255; 0; 0.5)";

  public Shadow:boolean = true;

  public Fill:boolean = true;
  public FillColor:string = "rgba(0; 255; 0; 0.15)";
}

