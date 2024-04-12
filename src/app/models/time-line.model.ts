import { FlagsModel } from "./flag.model";

export class TimeLineModel {
  constructor(
    public time_line: FlagsModel,
    public iam_id?: string,
  ) {
  }
}
