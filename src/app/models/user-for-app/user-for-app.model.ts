

export class LastPaymentModel {
  constructor(
    public created: number,
    public current_date: string,
    public expiry_date: string,
    public current_date_timestamp: number,
    public expiry_date_timestamp: number,
    public payment_plan_type: string,
    public customer_email: string,
    // public brand: string,
    // public last4: string
    
  ) { }
}



export class UserForAppModel {
    constructor(
      public email: string,
      public sub: string,
      public password_changed_times: number,
      public last_payment?: any
    ) { }
  }
  