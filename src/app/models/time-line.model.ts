import { FlagsModel } from "./flag.model";

export class TimeLineModel {
  constructor(
    public iam_id: string,
    public time_line: FlagsModel
  ) {
  }
}
