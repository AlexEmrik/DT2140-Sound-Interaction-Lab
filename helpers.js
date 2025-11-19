//==========================================================================================

function findByAddress(obj, address) {
    if (obj.address === address) return obj;
    if (Array.isArray(obj)) {
        for (const el of obj) {
            const found = findByAddress(el, address);
            if (found) return found;
        }
    } else if (obj && typeof obj === 'object') {
        for (const key in obj) {
            const found = findByAddress(obj[key], address);
            if (found) return found;
        }
    }
    return null;
}

//==========================================================================================

function getParamMinMax(param) {
    const minValue = param?.min;
    const maxValue = param?.max;
    return [minValue, maxValue]
}

//==========================================================================================

function setMotionListeners() {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    // alert('Motion sensors permission denied. Please enable in Settings > Safari > Motion & Orientation Access');

    // iOS 13+ requires permission request from user gesture
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          console.log("Permission granted to sensors");
        }
      })
      .catch((error) => {
        console.log("Error getting sensor permission: %O", error);
        alert('Motion sensors permission denied.');
      });
  }
}

//==========================================================================================
// Enable audio and motion sensors after a user gesture
function enableAudioAndSensors() {

  // 🔊 Resume audio if needed
  if (window.audioContext && audioContext.state === "suspended") {
    audioContext.resume().then(() => {
      console.log("Audio resumed");
    });
  }

  // 📱 Request motion permission if the browser requires it (iOS & some Android)
  if (typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission()
      .then(response => {
        if (response !== "granted") {
          console.warn("Motion permission denied");
        }
      })
      .catch(console.error);
  }

  console.log("Audio + sensors enabled");
}

//==========================================================================================

const audioContext = new AudioContext();