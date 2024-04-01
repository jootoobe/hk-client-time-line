
// SignUp
export class RedisAuthModel {
  constructor(
    public email: string,
    public skich: string,
    public sub: string, // user id
    public irt_id: string, //refresh_token_id
    public iat: string, // iam + access_token
    public irt: string, // iam + refresh_token
    public password_changed_times: number, // é o comprimento do password_last_change array
    public password: string,
    public expires: {
      token: number,
      refresh_token: number
    },

  ) { }

}
