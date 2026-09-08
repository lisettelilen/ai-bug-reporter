import fetch from 'node-fetch';

const payloadA = {
  evidence: {
    network: {
      url: "/checkout",
      method: "POST",
      statusCode: 500,
      timestamp: "2026-09-06T20:30:00Z"
    },
    userDescription: null,
    screenshot: null,
    observations: []
  }
};

fetch('http://localhost:3000/api/generate-bug-report', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payloadA)
})
  .then(response => {
    console.log('Test A HTTP STATUS:', response.status);
    return response.json();
  })
  .then(data => console.log('Test A RESPONSE BODY:', JSON.stringify(data, null, 2)));