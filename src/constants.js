// @flow
// $FlowExpectedError
import { LOCALE } from './consts';

// Edit the key below
export const API_KEY = '651899cf9c5d4e4284ce396543a43eb8';

export const IETF_LANGUAGE = LOCALE.replace('_', '-');

export const MAX_LIST_LENGTH = 20;
export const API_PATH = `https://api.opencagedata.com/geocode/v1/json?language=${IETF_LANGUAGE}&key=${API_KEY}`;
