export class GeolocationModel {
  constructor(
    public country_name: string, //countryName
    public country_code: string, //countryCode
    public state: string, //city
    public city: string, // locality
    public longitude: string, // longitude
    public latitude: string, // latitude
  ) { }
}
