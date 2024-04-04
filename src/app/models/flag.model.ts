import { DateObjModel } from "./date-obj.model";
import { FlagDesignModel } from "./flag-design.model";
import { SocialMediaChipModel } from "./social-media-chip.model";
import { SubjectTagModel } from "./subject-tag.model";

export class FlagModel {
  constructor(
    public year: string,
    public flag_id: string,
    public flag_title: string,
    public flag_description: string,
    public flag_style: any,
    public color_hex: string,
    public color_rgb: string,
    public color_hsl: string,
    public flag_local_zone: string,
    public flag_created_at: string,
    public flag_update_at: string,
    public flag_margin_right: string,
    public date_obj: DateObjModel,
    public social_medias_chips: SocialMediaChipModel[],
    public subject_tags: SubjectTagModel[],
    public flags2?: FlagModel[],
    public flag_design?: FlagDesignModel,

  ) {
  }
}


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
