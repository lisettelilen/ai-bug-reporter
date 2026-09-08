import fetch from 'node-fetch';

const payloadB = {
  evidence: {
    network: {
      url: "/login",
      method: "POST",
      statusCode: 401,
      timestamp: "2026-09-06T20:31:00Z"
    },
    userDescription: "El usuario dice que no puede iniciar sesión.",
    screenshot: null,
    observations: []
  }
};

fetch('http://localhost:3000/api/generate-bug-report', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payloadB)
})
  .then(response => {
    console.log('Test B HTTP STATUS:', response.status);
    return response.json();
  })
  .then(data => console.log('Test B RESPONSE BODY:', JSON.stringify(data, null, 2)));