// @flow
export type TNativeLocation = {
  time: number,
  longitude: number,
  latitude: number
};

export type TExtendedNativeLocation = TNativeLocation & {
  address: string,
  addressComponents: {
    "ISO_3166-1_alpha-2": string,
    "ISO_3166-1_alpha-3": string,
    city: string,
    city_district: string,
    continent: string,
    country: string,
    country_code: string,
    county: string,
    house_number: string,
    neighbourhood: string,
    political_union: string,
    postcode: string,
    road: string,
    state: string,
    _type: string
  }
};

export type TNativeLocationPermissions = {
  granted: boolean
};
