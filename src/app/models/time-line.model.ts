import { FlagModel } from "./flag.model";

export class FlagsModel {
  constructor(
    public flags: FlagModel[],
  ) {
  }
}


export class TimeLineModel {
  constructor(
    public iam_id: string,
    public time_line: FlagsModel
  ) {
  }
}
