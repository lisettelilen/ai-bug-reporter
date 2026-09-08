let activeScanId = '';

chrome.webRequest.onCompleted.addListener(
  async (details) => {
    // Si el Service Worker fue suspendido y despertó,
    // recuperar el scan activo desde storage.
    if (!activeScanId) {
      const data = await chrome.storage.session.get(
        'activeScanId'
      );

      activeScanId = data.activeScanId || '';
    }

    // Ignorar respuestas exitosas
    if (details.statusCode < 400) {
      return;
    }

    // Ignorar si no hay un escaneo activo
    if (!activeScanId) {
      return;
    }

    // Ignorar los propios requests del scanner
    if (
      details.url.includes(
        '/api/network-events'
      )
    ) {
      return;
    }

    const errorInfo = {
      url: details.url,
      statusCode: details.statusCode,
      method: details.method,
      timestamp: new Date().toISOString(),
      tabId: details.tabId,
      type: details.type,
      scanId: activeScanId
    };

    console.log(
      'HTTP ERROR DETECTED:',
      errorInfo
    );

    try {
      const data =
        await chrome.storage.local.get(
          'errorHistory'
        );

      const history =
        data.errorHistory || [];

      const isDuplicate =
        history.some(
          (error) =>
            error.url ===
              errorInfo.url &&
            error.statusCode ===
              errorInfo.statusCode &&
            error.method ===
              errorInfo.method
        );

      const updatedHistory =
        isDuplicate
          ? history
          : [
              errorInfo,
              ...history
            ].slice(0, 20);

      await chrome.storage.local.set({
        lastError: errorInfo,
        errorHistory:
          updatedHistory
      });

      await sendErrorToAPI(
        errorInfo
      );

      console.log(
        'ERROR SAVED:',
        errorInfo
      );

      console.log(
        'ERROR HISTORY:',
        updatedHistory
      );

    } catch (error) {
      console.error(
        'ERROR SAVING HTTP ERROR:',
        error
      );
    }
  },
  {
    urls: ['<all_urls>']
  }
);


async function sendErrorToAPI(
  errorInfo
) {
  try {
    const response =
      await fetch(
        'https://ai-bug-reporter-fawn.vercel.app/api/network-events',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify(
            errorInfo
          )
        }
      );

    if (!response.ok) {
      console.error(
        'Error al enviar la información del error a la API',
        response
      );
    }

  } catch (error) {
    console.error(
      'Error al enviar el mensaje a la API',
      error
    );
  }
}


chrome.runtime.onMessage.addListener(
  (
    request,
    sender,
    sendResponse
  ) => {

    if (
      request.type ===
      'START_SCAN'
    ) {

      if (!request.scanId) {
        sendResponse({
          success: false,
          error:
            'Missing scanId'
        });

        return;
      }

      activeScanId =
        request.scanId;

      // Persistir el scan activo
      // para sobrevivir a la suspensión
      // del Service Worker.
      chrome.storage.session.set({
        activeScanId:
          activeScanId
      });

      console.log(
        'SCAN STARTED:',
        activeScanId
      );

      sendResponse({
        success: true
      });

      return true;
    }


    if (
      request.type ===
      'STOP_SCAN'
    ) {

      console.log(
        'SCAN STOPPED:',
        activeScanId
      );

      activeScanId = '';

      // Eliminar el scan activo
      // del storage.
      chrome.storage.session.remove(
        'activeScanId'
      );

      sendResponse({
        success: true
      });

      return true;
    }
  }
);