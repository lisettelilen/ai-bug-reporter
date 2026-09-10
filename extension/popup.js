console.log("popup.js cargado");

document.getElementById('send-error').addEventListener('click', async () => {
  console.log("Botón 'Enviar error' clicado");

  const feedback = document.getElementById('feedback');
  const loading = document.getElementById('loading');

  feedback.classList.add('hidden');
  loading.classList.remove('hidden');

  try {
    const data = await chrome.storage.local.get('lastError');
    const errorInfo = data.lastError;

    if (!errorInfo) {
      feedback.textContent = 'No se encontraron errores registrados.';
      feedback.classList.remove('hidden');
      return;
    }

    const evidence = {
      url: errorInfo.url,
      statusCode: errorInfo.statusCode,
      method: errorInfo.method,
      timestamp: errorInfo.timestamp
    };

    const API_BASE_URL = 'https://ai-bug-reporter-fawn.vercel.app';

    const response = await fetch(
      `${API_BASE_URL}/api/generate-bug-report`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ evidence })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        'Generate bug report error:',
        response.status,
        errorText
      );

      feedback.textContent =
        'Error al generar el reporte (' + response.status + ').';

      feedback.classList.remove('hidden');
      return;
    }

    const result = await response.json();

    console.log("API RESULT:", result);
    console.log("REPORT:", result.report);
    console.log("REPORT TYPE:", typeof result.report);

    if (!result.report || typeof result.report !== 'object') {
      feedback.textContent =
        'La API no devolvió un reporte válido.';

      feedback.classList.remove('hidden');
      return;
    }

    console.log(
      "FULL REPORT:",
      JSON.stringify(result.report, null, 2)
    );

    console.log("PRIORITY:", result.report.priority);
    console.log("PRECONDITIONS:", result.report.preconditions);

    feedback.textContent = '';

    const fields = [
      ['Título', result.report.title],
      ['Descripción', result.report.description],
      ['Prioridad', result.report.priority],
      ['Precondiciones', result.report.preconditions],
      ['Pasos para reproducir', result.report.stepsToReproduce],
      ['Resultado actual', result.report.actualResult],
      ['Resultado esperado', result.report.expectedResult],
      ['Entorno', result.report.environment],
      ['Causa técnica', result.report.technicalCause]
    ];

    fields.forEach(([label, value]) => {
      const section = document.createElement('div');
      section.className = 'mb-3';

      const title = document.createElement('strong');
      title.textContent = `${label}: `;

      const content = document.createElement('span');

      if (Array.isArray(value)) {
        content.textContent =
          value.length > 0
            ? value.join(' | ')
            : 'No se identificaron precondiciones en la evidencia proporcionada.';
      } else {
        content.textContent =
          value ||
          'No disponible en la evidencia proporcionada.';
      }

      section.appendChild(title);
      section.appendChild(content);

      feedback.appendChild(section);
    });

    feedback.classList.remove('hidden');

  } catch (error) {
    console.error('Error enviando evidencia:', error);

    feedback.textContent =
      'No se pudo conectar con AI Bug Reporter.';

    feedback.classList.remove('hidden');

  } finally {
    loading.classList.add('hidden');
  }
});