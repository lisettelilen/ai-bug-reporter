import fetch from 'node-fetch';

const payload = {
  evidence: {
    network: {
      url: "/api/users",
      method: "GET",
      statusCode: 500,
      timestamp: "2026-09-06T20:00:00Z"
    },
    userDescription: "Al hacer clic en el botón Guardar, aparece un mensaje de error 500.",
    screenshot: null,
    observations: []
  }
};

fetch('http://localhost:3000/api/generate-bug-report', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
  .then(response => {
    console.log('HTTP STATUS:', response.status);
    return response.json();
  })
  .then(data => console.log('RESPONSE BODY:', JSON.stringify(data, null, 2)))
  .catch(error => console.error('Error:', error));