import { FlagModel } from "../flag.model"


export class DoubleCheckDialogModel {
  constructor(
    public modals: {
      types: {
        type: string,
        flag: FlagModel
        _id?: string,
      }
    }
  ) {
  }
}
