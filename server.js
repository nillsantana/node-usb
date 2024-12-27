const express = require('express');
const usb = require('usb');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// Rota para listar dispositivos USB
app.get('/list-devices', (req, res) => {
  const devices = usb.getDeviceList().map(device => ({
    busNumber: device.busNumber,
    deviceAddress: device.deviceAddress,
    manufacturer: device.deviceDescriptor.idVendor,
    product: device.deviceDescriptor.idProduct
  }));
  res.json(devices);
});

// Rota para enviar dados para um dispositivo
app.post('/send-data', (req, res) => {
  const { busNumber, deviceAddress, data } = req.body;

  // Localizar o dispositivo pelo busNumber e deviceAddress
  const device = usb.getDeviceList().find(
    d => d.busNumber === busNumber && d.deviceAddress === deviceAddress
  );

  if (!device) {
    return res.status(404).json({ message: 'Dispositivo não encontrado' });
  }

  try {
    device.open();
    const iface = device.interfaces[0];
    iface.claim();

    // Obter endpoint de escrita (saída)
    const outEndpoint = iface.endpoints.find(e => e.direction === 'out');

    if (!outEndpoint) {
      return res.status(400).json({ message: 'Sem endpoint de saída disponível' });
    }

    outEndpoint.transfer(Buffer.from(data), error => {
      if (error) {
        return res.status(500).json({ message: 'Erro ao enviar dados', error });
      }
      res.json({ message: 'Dados enviados com sucesso!' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao interagir com o dispositivo', error });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
