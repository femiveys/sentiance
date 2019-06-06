// @flow
import axios from 'axios';

import type { $AxiosXHR } from 'axios';

import { API_PATH } from './constants';

// eslint-disable-next-line import/prefer-default-export
export const reverseGeoCode = (
  latitude: number,
  longitude: number
): Promise<$AxiosXHR<any>> => axios.get(`${API_PATH}&q=${latitude}+${longitude}`);
