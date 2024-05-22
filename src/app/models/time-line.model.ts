import { FlagsModel } from "./flag.model";

export class TimeLineModel {
  constructor(
    public time_line: FlagsModel,
    public iam_id?: string,
    public year?: string, // para o indexDB não dar erro
    public a?: string, // para o indexDB não dar erro
    public _id?: string, 

  ) {
  }
}
