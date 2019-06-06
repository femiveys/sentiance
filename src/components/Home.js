// @flow
import {
  Button,
  NativeModules,
  View,
  DeviceEventEmitter,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList
} from 'react-native';
import * as React from 'react';
import MapView, { Marker } from 'react-native-maps';
import format from 'date-fns/format';

import type {
  TNativeLocation,
  TExtendedNativeLocation,
  TNativeLocationPermissions
} from '../types';

import { MAX_LIST_LENGTH } from '../constants';
import { reverseGeoCode } from '../api';
import { colors, margins } from '../theme';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.lightGrey,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  title: {
    textAlign: 'center',
    padding: margins.m,
    fontSize: 30
  },
  horizontal: {
    flexDirection: 'row'
  },
  buttonWrapper: {
    padding: margins.l
  },
  tab: {
    color: 'black',
    flex: 1,
    padding: margins.m
  },
  activeTab: {
    backgroundColor: colors.lightGrey,
    borderColor: colors.darkGrey,
    borderWidth: 1,
    borderBottomWidth: 0
  },
  inactiveTab: {
    backgroundColor: colors.grey
  },
  tabContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.lightGrey,
    borderColor: colors.darkGrey,
    borderWidth: 1,
    borderTopWidth: 0
  },
  time: {
    width: 130
  },
  flexFill: {
    flex: 1
  },
  row: {
    padding: margins.m
  },
  even: {
    backgroundColor: colors.white
  },
  odd: {
    backgroundColor: colors.transparent
  },
  warning: {
    backgroundColor: colors.orange,
    padding: margins.m
  }
});

type TProps = {};
type TState = {
  active: boolean,
  activeTab: "map" | "list",
  locationList: Array<TExtendedNativeLocation>,
  permissionsGranted: boolean
};

class Home extends React.Component<TProps, TState> {
  state = {
    active: false,
    activeTab: 'map',
    locationList: [],
    permissionsGranted: true
  };

  mapRef: any;

  constructor(props: TProps) {
    super(props);
    this.mapRef = React.createRef<MapView>();
  }

  componentDidMount() {
    DeviceEventEmitter.addListener(
      'nativeLocation',
      this.nativeLocationListener
    );
    DeviceEventEmitter.addListener(
      'nativeLocationPermissions',
      this.nativeLocationPermissionsListener
    );
  }

  componentDidUpdate() {
    const { locationList } = this.state;

    if (this.mapRef.current && locationList.length > 0) {
      const coordinates = locationList.map(location => ({
        longitude: location.longitude,
        latitude: location.latitude
      }));

      this.mapRef.current.fitToCoordinates(coordinates);
    }
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener(
      'nativeLocation',
      this.nativeLocationListener
    );
    DeviceEventEmitter.removeListener(
      'nativeLocationPermissions',
      this.nativeLocationPermissionsListener
    );
  }

  nativeLocationListener = (nativeLocation: TNativeLocation) => {
    const { locationList } = this.state;
    const locationListCopy = [...locationList];
    if (locationListCopy.length === MAX_LIST_LENGTH) {
      locationListCopy.shift();
    }

    reverseGeoCode(nativeLocation.latitude, nativeLocation.longitude).then(
      (response) => {
        const extendedNativeLocation: TExtendedNativeLocation = {
          ...nativeLocation,
          address: response.data.results[0].formatted,
          addressComponents: response.data.results[0].components
        };

        locationListCopy.push(extendedNativeLocation);
        this.setState({
          locationList: locationListCopy
        });
      }
    );
  };

  nativeLocationPermissionsListener = (
    permissions: TNativeLocationPermissions
  ) => {
    this.setState({
      permissionsGranted: permissions.granted,
      active: permissions.granted
    });
  };

  onPressStart = () => {
    NativeModules.NativeLocation.start(1000, 100);
  };

  onPressStop = () => {
    NativeModules.NativeLocation.stop();
    this.setState({ active: false });
  };

  onPressReset = () => {
    this.setState({ locationList: [] });
  };

  formatTime = (location: TExtendedNativeLocation) => format(location.time, 'D/M/YYYY H:mm:ss');

  renderItem = ({
    item,
    index
  }: {
    item: TExtendedNativeLocation,
    index: number
  }) => (
    <View
      style={[
        styles.horizontal,
        index % 2 === 0 ? styles.even : styles.odd,
        styles.row
      ]}
    >
      <Text style={styles.time}>{this.formatTime(item)}</Text>
      <Text style={styles.flexFill}>{item.address}</Text>
    </View>
  );

  render() {
    const {
      locationList, active, activeTab, permissionsGranted
    } = this.state;

    return (
      <View style={styles.flexFill}>
        {!permissionsGranted && (
          <Text style={styles.warning}>
            I need to be able to access your location. Grant the permission then
            try again to hit start
          </Text>
        )}
        <Text style={styles.title}>Locations</Text>
        <View style={styles.horizontal}>
          <View style={styles.buttonWrapper}>
            <Button
              onPress={this.onPressStart}
              title="Start"
              color="green"
              disabled={active && permissionsGranted}
              accessibilityLabel="Start logging locations"
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              onPress={this.onPressStop}
              title="Stop"
              color="red"
              disabled={!active}
              accessibilityLabel="Stop logging locations"
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              onPress={this.onPressReset}
              title="Reset"
              color="grey"
              disabled={locationList.length === 0}
              accessibilityLabel="Stop logging locations"
            />
          </View>
        </View>
        <View style={styles.horizontal}>
          <TouchableOpacity
            accessibilityLabel="Change to map tab"
            onPress={() => this.setState({ activeTab: 'map' })}
            style={[
              styles.tab,
              activeTab === 'map' ? styles.activeTab : styles.inactiveTab
            ]}
          >
            <Text>Map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel="Change to map list"
            onPress={() => this.setState({ activeTab: 'list' })}
            style={[
              styles.tab,
              activeTab === 'list' ? styles.activeTab : styles.inactiveTab
            ]}
          >
            <Text>List</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flexFill}>
          <View style={[styles.tabContent, styles.container]}>
            <MapView ref={this.mapRef} style={styles.map} maxZoomLevel={15}>
              {locationList.map(location => (
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude
                  }}
                  title={location.address}
                  description={this.formatTime(location)}
                  key={location.time}
                  identifier={location.time.toString()}
                />
              ))}
            </MapView>
          </View>
          {activeTab === 'list' && (
            <View style={[styles.tabContent, styles.flexFill]}>
              <FlatList
                data={locationList}
                renderItem={this.renderItem}
                keyExtractor={item => item.time.toString()}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default Home;
