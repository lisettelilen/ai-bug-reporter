import fetch from 'node-fetch';

const payloadC = {
  evidence: {
    network: {
      url: "/settings/profile",
      method: "POST",
      statusCode: 500,
      timestamp: "2026-09-06T20:40:00Z"
    },
    userDescription: "Al guardar el perfil aparece un error 500.",
    screenshot: null,
    observations: [
      "El usuario abrió la pantalla de perfil.",
      "El usuario modificó el campo Nombre.",
      "El usuario hizo clic en Guardar.",
      "Después del clic apareció el error 500."
    ]
  }
};

fetch('http://localhost:3000/api/generate-bug-report', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payloadC)
})
  .then(response => {
    console.log('Test C HTTP STATUS:', response.status);
    return response.json();
  })
  .then(data => console.log('Test C RESPONSE BODY:', JSON.stringify(data, null, 2)));