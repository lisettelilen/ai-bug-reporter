// contentScript.js

console.log('🚀 CONTENT SCRIPT CARGADO');

window.addEventListener('message', (event) => {
  if (event.source !== window) {
    return;
  }

  const data = event.data;

  if (!data || data.source !== 'ai-bug-reporter') {
    return;
  }

  console.log('📨 MENSAJE RECIBIDO EN CONTENT SCRIPT:', data);

  if (data.type === 'START_SCAN') {
    console.log('➡️ ENVIANDO START_SCAN AL SERVICE WORKER');

    chrome.runtime.sendMessage(
      {
        type: 'START_SCAN',
        scanId: data.scanId
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            '❌ ERROR ENVIANDO AL SERVICE WORKER:',
            chrome.runtime.lastError.message
          );
          return;
        }

        console.log(
          '✅ RESPUESTA DEL SERVICE WORKER:',
          response
        );
      }
    );
  }

  if (data.type === 'STOP_SCAN') {
    console.log('➡️ ENVIANDO STOP_SCAN AL SERVICE WORKER');

    chrome.runtime.sendMessage(
      {
        type: 'STOP_SCAN'
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            '❌ ERROR ENVIANDO STOP_SCAN:',
            chrome.runtime.lastError.message
          );
          return;
        }

        console.log(
          '✅ RESPUESTA STOP_SCAN:',
          response
        );
      }
    );
  }
});// contentScript.js
// Este archivo puede interactuar con las páginas web según sea necesario.