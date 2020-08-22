import React, {useState} from "react"

function isPushNotificationSupported() {
  return "serviceWorker" in navigator && "PushManager" in window;
}
