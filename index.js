if (!navigator.bluetooth) {
  alert('Sorry, your browser doesn\'t support Bluetooth API');
}

var first = new Uint8Array(18);
var second = new Uint8Array(18);

var i;
for (i = 0; i < first.length; i++) {
  first[i] = i+10;
}

const MY_BLUETOOTH_NAME = 'Arduino';
const SEND_SERVICE = '19B10000-E8F2-537E-4F6C-D104768A1214';
const SEND_SERVICE_CHARACTERISTIC = '19B10001-E8F2-537E-4F6C-D104768A1214';

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
  return toggleLigthCharacteristic.writeValue(Uint8Array.of(0));
}

function toggleLightButtonClickHandler(event) {
  const code = Number(event.target.dataset.code);

  if (code === 1) {
    toggleLigthCharacteristic.writeValue(first);

    return;
  }

  toggleLigthCharacteristic.readValue()
    .then(currentCode => {
      const convertedCode = currentCode.getUint8(0);

      toggleLigthCharacteristic.writeValue(Uint8Array.of(convertedCode === code ? 0 : code));
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
