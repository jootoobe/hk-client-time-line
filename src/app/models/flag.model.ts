import { DateObjModel } from "./date-obj.model";
import { FlagDesignModel } from "./flag-design.model";
import { GeolocationModel } from "./geolocation.model";
import { SocialMediaChipModel } from "./social-media-chip.model";
import { SubjectTagModel } from "./subject-tag.model";

export class FlagModel {
  constructor(
    public year: string,
    public flag_id: string,
    public flag_title: string,
    public flag_description: string,
    public flag_style: any,
    public flag_created_at: string,
    public flag_update_at: string,
    public flag_margin_right: string,
    public flag_design: FlagDesignModel,
    public date_obj: DateObjModel,
    public social_medias_chips: SocialMediaChipModel[],
    public subject_tags: SubjectTagModel[],
    public geolocation?: GeolocationModel,
    public flags2?: FlagModel[],
    public edit?: string, // para edição
    public flag_status_update?: string, // o status pode ser update, delete or create - usado quando a flag é editada
  ) {
  }
}


export class FlagsModel {
  constructor(
    public flags: FlagModel[],
  ) {
  }
}
