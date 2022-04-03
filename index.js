/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import PushNotification from 'react-native-push-notification';



AppRegistry.registerComponent(appName, () => App);

PushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    onNotification: function (notification) {
        console.log('LOCAL NOTIFICATION ==>', notification)
    },

    popInitialNotification: true,
    requestPermissions: true,
});