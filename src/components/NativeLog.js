// @flow
import * as React from 'react';
import { DeviceEventEmitter } from 'react-native';

type Props = {};
export default class App extends React.Component<Props> {
  componentDidMount() {
    DeviceEventEmitter.addListener('nativeLog', this.listener);
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener('nativeLog', this.listener);
  }

  // TODO remove any
  listener = (e: any) => {
    console.log({ ...e });
  };

  render() {
    return null;
  }
}
