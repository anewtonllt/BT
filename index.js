if (!navigator.bluetooth) {
  alert('Sorry, your browser doesn\'t support Bluetooth API');
}

var firstP = new Uint8Array(9);
var off = new Uint8Array(9);

var i;
for (i = 0; i < off.length; i++) {
  off[i] = 0;
}

const MY_BLUETOOTH_NAME = 'LED';
const SEND_SERVICE = '4832d3e4-50cb-11eb-ae93-0242ac130002';
const SEND_SERVICE_CHARACTERISTIC = '4832d61e-50cb-11eb-ae93-0242ac130002';

const controlButtonsListElements = document.querySelectorAll('.control-buttons > li');
const connectButton = document.getElementById('connectButton');
const disconnectButton = document.getElementById('disconnectButton');
const lightOffButton = document.getElementById('lightOff');
const toggleRedLightButton = document.getElementById('toggleRedLight');
const toggleBlueLightButton = document.getElementById('toggleBlueLight');
const toggleGreenLightButton = document.getElementById('toggleGreenLight');
const runBlinkLightButton = document.getElementById('runBlinkLight');

let toggleLigthCharacteristic;
let myDevice;

connectButton.addEventListener('pointerup', connectButtonPointerUpHandler);

function connectButtonPointerUpHandler() {
  navigator.bluetooth.requestDevice({
    filters:
      [
        { name: MY_BLUETOOTH_NAME },
        { services: [SEND_SERVICE] },
      ]
  })
    .then(device => {
      myDevice = device;

      return device.gatt.connect();
    })
    .then(server => server.getPrimaryService(SEND_SERVICE))
    .then(service => service.getCharacteristic(SEND_SERVICE_CHARACTERISTIC))
    .then(characteristic => {
      toggleLigthCharacteristic = characteristic;

      toggleButtonsVisible();
      toggleItemsEventListeners('addEventListener');
    })
    .catch(error => {
      console.error(error);
    });
}

function lightOffButtonClickHandler() {
  return toggleLigthCharacteristic.writeValue(off);
}

function toggleLightButtonClickHandler(event) {
  const code = Number(event.target.dataset.code);

  if (code === 1) {
    toggleLigthCharacteristic.writeValue(firstP);
    return;
  }
  if (code === 2) {
    toggleLigthCharacteristic.writeValue(off);
    return;
  }
  toggleLigthCharacteristic.readValue()
    var i;
    for (i = 0; i < firstP.length; i++) {
      firstP[i] = code;
    }
      toggleLigthCharacteristic.writeValue(firstP);
    });
}

function toggleButtonsVisible() {
  Array.prototype.forEach.call(controlButtonsListElements, listElement => {
    listElement.classList.toggle('visible');
  });
}

function disconnectButtonClickHandler() {
  lightOffButtonClickHandler()
    .then( () => {
      myDevice.gatt.disconnect();

      toggleItemsEventListeners('removeEventListener');
      toggleButtonsVisible();

      toggleLigthCharacteristic = undefined;
      myDevice = undefined;
    });
}

function toggleItemsEventListeners(action) {
  disconnectButton[action]('click', disconnectButtonClickHandler);
  lightOffButton[action]('click', lightOffButtonClickHandler);
  runBlinkLightButton[action]('click', toggleLightButtonClickHandler);
  toggleGreenLightButton[action]('click', toggleLightButtonClickHandler);
  toggleRedLightButton[action]('click', toggleLightButtonClickHandler);
  toggleBlueLightButton[action]('click', toggleLightButtonClickHandler);
}
