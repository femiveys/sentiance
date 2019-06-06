## Assumptions and choices

- This project has been implemented and tested for Android only.
- Though I prefer working with TypeScript, **flow** has been used for typings
- Though they are not used heavily, I have decided to use following standard modules
  - `axios`
  - `date-fns`
- Though in the real world `react-native-config` should be used, I have chosen to just edit a JS file for the API_KEY
- To simulate location changes I have used Lockito
- Location updates only occur at an interval minimum 1 second and 100 meters
- No tests have been written

## Run the app

- Unzip
- `cd sentiance`
- Edit `src/constants.js` and enter your `API_KEY` for https://opencagedata.com/api
- Edit `android/app/src/main/AndroidManifest.xml` and enter the value for `com.google.android.geo.API_KEY`
- Attach an Android device
- `yarn start`
- Simulate a trajectory with Lockito
