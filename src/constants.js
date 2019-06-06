// @flow
// $FlowExpectedError
import { LOCALE } from './consts';

// Edit the key below
export const API_KEY = 'PUT_KEY_HERE';

export const IETF_LANGUAGE = LOCALE.replace('_', '-');

export const MAX_LIST_LENGTH = 20;
export const API_PATH = `https://api.opencagedata.com/geocode/v1/json?language=${IETF_LANGUAGE}&key=${API_KEY}`;
