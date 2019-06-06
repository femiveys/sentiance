// @flow
import { NativeModules } from 'react-native';

// eslint-disable-next-line import/prefer-default-export
export const LOCALE = NativeModules.I18nManager.localeIdentifier;
