document.getElementById('listDevices').addEventListener('click', async () => {
    const response = await fetch('/list-devices');
    const devices = await response.json();
  
    const deviceList = document.getElementById('deviceList');
    deviceList.innerHTML = '';
    const deviceSelect = document.getElementById('deviceSelect');
    deviceSelect.innerHTML = '';
  
    devices.forEach(device => {
      const listItem = document.createElement('li');
      listItem.textContent = `Bus: ${device.busNumber}, Address: ${device.deviceAddress}, Vendor: ${device.manufacturer}, Product: ${device.product}`;
      deviceList.appendChild(listItem);
  
      const option = document.createElement('option');
      option.value = JSON.stringify(device);
      option.textContent = `Bus: ${device.busNumber}, Address: ${device.deviceAddress}`;
      deviceSelect.appendChild(option);
    });
  });
  
  document.getElementById('sendDataForm').addEventListener('submit', async event => {
    event.preventDefault();
  
    const device = JSON.parse(document.getElementById('deviceSelect').value);
    const data = document.getElementById('dataToSend').value;
  
    const response = await fetch('/send-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...device, data })
    });
  
    const result = await response.json();
    alert(result.message || 'Erro desconhecido');
  });
  