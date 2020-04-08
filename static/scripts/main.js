var ws = new WebSocket(
  `ws://${location.hostname}:3001`
);
ws.onmessage = function (event) {
  let data = JSON.parse(event.data);
  updateDashboard(data);
};

var mode;
var isOn;

function updateDashboard(data) {
  for (key in data) {	 
    switch(key) {
      case "sensors": 
        for (let sensor of data.sensors) {
          let sensorElement = 
            document.getElementById(sensor.name);
          if (sensorElement) {
            sensorElement.getElementsByClassName("time")[0].innerHTML 
            = new Date(sensor.time).toLocaleTimeString();
            sensorElement.getElementsByClassName("measurement")[0].innerHTML 
            = sensor.measurement.toFixed(3); 
          }
        }
        break;
      case 'outlet': 
        isOn = data.outlet.state;
        isOnButton.innerHTML = isOn
    }
  }  
}

modeButton.addEventListener('click', () => {
  if (mode == 'manual') {
    mode = 'auto';
  } else {
    mode = 'manual';
  }
  modeButton.innerHTML = mode;
  ws.send(JSON.stringify({mode: mode}));
});

isOnButton.addEventListener('click', () => {
  if (mode == 'manual') {
    isOn = !isOn;
    ws.send(JSON.stringify({isOn: isOn}));
  }
})

threshold.addEventListener('input', () => {
  ws.send(JSON.stringify({threshold: parseInt(threshold.value)}));
  thresholdLabel.innerHTML = threshold.value;
});

startTime.addEventListener('input', () => {
  console.log('start time changed');
  sendTimes();
});

endTime.addEventListener('input', () => {
  console.log('end time changed');
  sendTimes();
});

function sendTimes() {
  ws.send(JSON.stringify({
    startTime : startTime.value,
    endTime: endTime.value
  }));
}

