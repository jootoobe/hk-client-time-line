import { FlagModel } from "../flag.model"


export class DoubleCheckModel {
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
