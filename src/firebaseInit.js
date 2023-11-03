/* eslint-disable */
import firebase from 'firebase/app';
import 'firebase/messaging';

import { firebaseConfig } from 'utils/variable';

let defaultApp;
let messaging;
if (firebase.messaging.isSupported()) {
  defaultApp = firebase.initializeApp(firebaseConfig);
  messaging = firebase.messaging();
}

export const requestFirebaseNotificationPermission = () =>
  new Promise((resolve, reject) => {
    messaging
      .requestPermission()
      .then(() => messaging.getToken())
      .then((firebaseToken) => {
        resolve(firebaseToken);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });
