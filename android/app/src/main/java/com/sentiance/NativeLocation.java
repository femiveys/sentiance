package com.sentiance;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Map;
import java.util.HashMap;

import android.content.Context;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;

public class NativeLocation extends ReactContextBaseJavaModule {
    private LocationListener locationListener = createLocationListener();

    public NativeLocation(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "NativeLocation";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
//        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
//        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }

    @ReactMethod
    public void start(Double minTime, Float minDistance) {
        Context context = this.getReactApplicationContext();
        Activity activity = getCurrentActivity();

        WritableMap params = Arguments.createMap();

        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED
        && ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION)
                != PackageManager.PERMISSION_GRANTED
        ) {
            // Notify JS that Permission is not granted
            params.putBoolean("granted", false);
            sendEvent("nativeLocationPermissions", params);

            // Request the permission
            ActivityCompat.requestPermissions(activity,
                    new String[]{
                            Manifest.permission.ACCESS_FINE_LOCATION,
                            Manifest.permission.ACCESS_COARSE_LOCATION
                    },
                    3);


            nativeLog("permission not available2");

            return;
        }

        locationManager.requestLocationUpdates(
                LocationManager.GPS_PROVIDER,
                minTime.longValue(),
                minDistance,
                locationListener
        );

        params.putBoolean("granted", true);
        sendEvent("nativeLocationPermissions", params);

        nativeLog("start");
    }

    @ReactMethod
    public void stop() {
        locationManager.removeUpdates(locationListener);
        nativeLog("stop");
    }

    private LocationListener createLocationListener() {
        return new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {
                WritableMap params = Arguments.createMap();
                params.putDouble("latitude", location.getLatitude());
                params.putDouble("longitude", location.getLongitude());
                params.putDouble("time", location.getTime());
                sendEvent("nativeLocation", params);
            }

            @Override
            public void onProviderDisabled(String provider) {
                nativeLog("onProviderDisabled");
            }

            @Override
            public void onProviderEnabled(String provider) {
                nativeLog("onProviderEnabled");
            }

            @Override
            public void onStatusChanged(String provider, int status,
                                        Bundle extras) {
                // TODO Auto-generated method stub
            }
        };
    }

    private LocationManager locationManager = (LocationManager) this.getReactApplicationContext()
            .getSystemService(Context.LOCATION_SERVICE);

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        this.getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    private void nativeLog(String text) {
        WritableMap params = Arguments.createMap();
        params.putString("text", text);
        sendEvent("nativeLog", params);
    }
}
