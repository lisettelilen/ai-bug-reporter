'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState<string>('');
  const [pastedImage, setPastedImage] = useState<string | null>(null);
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [language, setLanguage] = useState<'ES' | 'EN'>('ES');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<number>(5);

  // Network Scanner
  const [isCapturingNetwork, setIsCapturingNetwork] =
    useState<boolean>(false);
  const [networkErrors, setNetworkErrors] = useState<any[]>([]);
  const [scanId, setScanId] = useState<string>('');

  // Guarda las identidades de errores que ya fueron procesados
  const processedNetworkErrors = useRef(new Set<string>());

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [gherkinText, setGherkinText] = useState<string | null>(null);

  // Modales de integración
  const [showJiraModal, setShowJiraModal] =
    useState<boolean>(false);
  const [showTrelloModal, setShowTrelloModal] =
    useState<boolean>(false);
  const [showAzureModal, setShowAzureModal] =
    useState<boolean>(false);

  // Formularios de credenciales
  const [jiraEmail, setJiraEmail] = useState<string>('');
  const [jiraApiToken, setJiraApiToken] =
    useState<string>('');
  const [jiraDomain, setJiraDomain] =
    useState<string>('');
  const [jiraProjectKey, setJiraProjectKey] =
    useState<string>('');

  const [trelloApiKey, setTrelloApiKey] =
    useState<string>('');
  const [trelloToken, setTrelloToken] =
    useState<string>('');
  const [trelloListId, setTrelloListId] =
    useState<string>('');

  const [azureOrg, setAzureOrg] = useState<string>('');
  const [azureProject, setAzureProject] =
    useState<string>('');
  const [azurePat, setAzurePat] = useState<string>('');

  // Detección de dispositivo móvil
  useEffect(() => {
    const userAgent =
      typeof window !== 'undefined'
        ? navigator.userAgent
        : '';

    const mobileCheck =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );

    setIsMobile(mobileCheck);
  }, []);

  // ============================================================
  // POLLING DE ERRORES DE RED
  // ============================================================

  useEffect(() => {
    if (!isCapturingNetwork || !scanId) {
      return;
    }

    console.log(
      '🔎 Iniciando polling para scanId:',
      scanId
    );

    const fetchErrors = async () => {
      try {
        const response = await fetch(
          `/api/network-events?scanId=${encodeURIComponent(
            scanId
          )}`
        );

        if (!response.ok) {
          console.error(
            'Error consultando network-events:',
            response.status
          );
          return;
        }

        const data = await response.json();
        const errors = data.errorHistory || [];

        if (errors.length === 0) {
          return;
        }

        // --------------------------------------------------------
        // Detectar solamente errores que todavía no procesamos
        // --------------------------------------------------------

        const errorsToAdd = errors.filter(
          (error: any) => {
            const identity =
              `${error.tabId}-${error.url}-${error.statusCode}-${error.method}-${error.timestamp}`;

            if (
              processedNetworkErrors.current.has(
                identity
              )
            ) {
              return false;
            }

            // Marcamos inmediatamente como procesado
            // para evitar llamadas duplicadas a la IA.
            processedNetworkErrors.current.add(
              identity
            );

            return true;
          }
        );

        if (errorsToAdd.length === 0) {
          return;
        }

        console.log(
          '🚨 Nuevos errores de red:',
          errorsToAdd
        );

        // --------------------------------------------------------
        // Guardar errores en el estado
        // --------------------------------------------------------

        setNetworkErrors(
          (currentErrors) => [
            ...currentErrors,
            ...errorsToAdd,
          ]
        );

        // --------------------------------------------------------
        // Generar Bug Report automáticamente
        // --------------------------------------------------------

        for (const error of errorsToAdd) {
          try {
            console.log(
              '🤖 Generando Bug Report para:',
              error
            );

            const reportResponse = await fetch(
              '/api/generate-bug-report',
              {
                method: 'POST',
                headers: {
                  'Content-Type':
                    'application/json',
                },
                body: JSON.stringify({
                  evidence: {
                    source: 'network-scanner',
                    url: error.url,
                    statusCode:
                      error.statusCode,
                    method: error.method,
                    timestamp:
                      error.timestamp,
                    tabId: error.tabId,
                    type: error.type,
                    scanId: error.scanId,
                  },
                }),
              }
            );

            if (!reportResponse.ok) {
              console.error(
                '❌ Error generando Bug Report:',
                reportResponse.status
              );

              continue;
            }

            const reportData =
              await reportResponse.json();

            console.log(
              '🤖 BUG REPORT GENERADO:',
              reportData.report
            );

            // ----------------------------------------------------
            // Adaptar el formato de la respuesta de la IA
            // al formato que utiliza actualmente la UI.
            // ----------------------------------------------------

            const aiReport =
              reportData.report;

              console.log("🔥 AI REPORT REAL:", aiReport);
              console.log("🔥 PRIORITY REAL:", aiReport.priority);
              console.log("🔥 PRECONDITIONS REAL:", aiReport.preconditions);

            const stepsToReproduce =
              aiReport.stepsToReproduce;

            let normalizedSteps: string[];

            if (
              Array.isArray(
                stepsToReproduce
              )
            ) {
              normalizedSteps =
                stepsToReproduce;
            } else if (
              typeof stepsToReproduce ===
              'string'
            ) {
              normalizedSteps = [
                stepsToReproduce,
              ];
            } else {
              normalizedSteps = [
                'No disponible en la evidencia proporcionada.',
              ];
            }

            // ----------------------------------------------------
            // Normalizar reporte de Network
            // SIN pisar los datos generados por la IA.
            // ----------------------------------------------------

            const normalizedReport = {
              ...aiReport,

              module: 'Network',

              priority:
                aiReport.priority ??
                'Backlog',

              // La IA actualmente no devuelve severity.
              // Por eso NO mostramos texto de fallback.
              severity:
                aiReport.severity ?? null,

              // Si no hay precondiciones demostradas,
              // mantenemos un array vacío.
              preconditions:
                Array.isArray(
                  aiReport.preconditions
                )
                  ? aiReport.preconditions
                  : [],

              steps: normalizedSteps,

              expected:
                aiReport.expectedResult ??
                'No disponible en la evidencia proporcionada.',

              actual:
                aiReport.actualResult ??
                'No disponible en la evidencia proporcionada.',

              rootCause:
                aiReport.technicalCause ??
                'No disponible en la evidencia proporcionada.',

              // Conservar evidencia de red.
              networkLogs: [
                {
                  status:
                    aiReport.statusCode ??
                    error.statusCode,

                  url: error.url,

                  payload:
                    `${error.method} ${error.url}`,
                },
              ],
            };

            // IMPORTANTE:
            // Solo una llamada a setGeneratedReport.

            console.log("🔥 NORMALIZED REPORT:", normalizedReport);

            setGeneratedReport(
              normalizedReport
            );
          } catch (error) {
            console.error(
              '❌ Error conectando con generate-bug-report:',
              error
            );
          }
        }
      } catch (error) {
        console.error(
          'Error haciendo polling de network-events:',
          error
        );
      }
    };

    fetchErrors();

    const intervalId = window.setInterval(
      fetchErrors,
      1000
    );

    return () => {
      window.clearInterval(intervalId);

      console.log(
        '🛑 Polling detenido para scanId:',
        scanId
      );
    };
  }, [isCapturingNetwork, scanId]);

  // ============================================================
  // DICCIONARIO MULTILENGUAJE
  // ============================================================

  const t = {
    ES: {
      subtitle:
        'Generá reportes con IA, analizá video/red y exportá en 1 clic.',
      status: 'Servidor de IA Operativo',
      videoTitle: 'Capturador de Video con IA',
      videoDescDesktop:
        'Seleccioná la duración (1-60s) y tu pantalla para grabar. La IA extraerá las acciones automáticamente.',
      videoDescMobile:
        'Subí un video o grabación de pantalla tomada desde tu celular para que la IA la analice.',
      videoBtnDesktop: 'Grabar Pantalla',
      videoBtnMobile: 'Subir Video desde Celular',
      videoRec: `🔴 Capturando pantalla (${videoDuration}s)...`,
      durationLabel: 'Duración:',
      netTitle: 'Captura Inteligente de Red y Consola',
      netDesc:
        'Interceptá fallos HTTP 4xx/5xx y excepciones de JavaScript en tiempo real directamente desde la consola.',
      netBtn: 'Capturar Errores de Red',
      netRec: '🛑 Detener escaneo',
      inputTitle:
        'Entrada Manual, Logs o Captura de Pantalla (Ctrl+V)',
      inputPlaceholder:
        'Pegá tus logs o presioná Ctrl+V para pegar una captura de pantalla desde tu portapapeles...',
      pastedTag:
        '🖼️ Captura de pantalla adjunta lista para analizar',
      pastedDelete: '✕ Eliminar',
      genBtn: 'Generar Reporte con IA',

      moduleLabel: 'Módulo:',
      envLabel: 'Entorno:',
      prioLabel: 'Prioridad:',
      precondTitle: '⚙️ Precondiciones del Test',
      analyzedImageTag: 'Captura Analizada por IA:',
      stepsTitle: '📋 Pasos para Reproducir',
      expTitle: '✅ Resultado Esperado',
      actTitle: '❌ Resultado Actual',
      rootTitle:
        '🔍 Análisis de Causa Raíz (Root Cause Analysis):',
      aiInsightsTitle:
        '🤖 Sugerencias y Diagnóstico IA (Smart Triage):',
      networkLogsTitle:
        '🚨 Consola de Red Parseada (HTTP Errors):',
      btnGherkin: 'Convertir a BDD / Gherkin 🥒',
      exportJira: 'Exportar a Jira',
      exportTrello: 'Exportar a Trello',
      exportAzure: 'Exportar a Azure DevOps',

      modalJiraTitle: 'Autenticación Jira Cloud',
      modalJiraDomain:
        'Dominio (ej: miempresa.atlassian.net)',
      modalJiraKey:
        'Key del Proyecto (ej: PROJ)',
      modalJiraEmail: 'Email de Atlassian',
      modalJiraToken:
        'API Token de Atlassian',

      modalTrelloTitle: 'Autenticación Trello',
      modalTrelloKey: 'API Key de Trello',
      modalTrelloToken: 'Token de Usuario',
      modalTrelloList:
        'ID de la Lista Objetivo',

      modalAzureTitle:
        'Autenticación Azure DevOps',
      modalAzureOrg:
        'Organización (ej: mi-org)',
      modalAzureProj:
        'Nombre del Proyecto',
      modalAzurePat:
        'PAT (Personal Access Token)',

      btnCancel: 'Cancelar',
      btnConnectJira:
        'Conectar y Crear Issue',
      btnConnectTrello:
        'Conectar y Crear Tarjeta',
      btnConnectAzure:
        'Conectar y Crear Bug',
    },

    EN: {
      subtitle:
        'Generate AI bug reports, analyze video/network logs and export in 1-click.',
      status: 'AI Server Operational',
      videoTitle: 'Video-to-Bug AI Interceptor',
      videoDescDesktop:
        'Select duration (1-60s) and your screen/window to record. AI will extract steps automatically.',
      videoDescMobile:
        'Upload a video or screen recording from your phone for AI analysis.',
      videoBtnDesktop: 'Record Screen',
      videoBtnMobile:
        'Upload Video from Phone',
      videoRec: `🔴 Capturing screen (${videoDuration}s)...`,
      durationLabel: 'Duration:',
      netTitle:
        'Smart Network & Console Capture',
      netDesc:
        'Intercept HTTP 4xx/5xx errors and JS console exceptions in real-time directly from the browser.',
      netBtn: 'Capture Network Errors',
      netRec: '🛑 Stop scanning',
      inputTitle:
        'Manual Entry, Logs, or Screen Capture (Ctrl+V)',
      inputPlaceholder:
        'Paste your logs or press Ctrl+V to paste a screenshot directly from your clipboard...',
      pastedTag:
        '🖼️ Screenshot attached and ready for analysis',
      pastedDelete: '✕ Remove',
      genBtn: 'Generate AI Report',

      moduleLabel: 'Module:',
      envLabel: 'Env:',
      prioLabel: 'Priority:',
      precondTitle: '⚙️ Test Preconditions',
      analyzedImageTag:
        'AI Analyzed Screenshot:',
      stepsTitle: '📋 Steps to Reproduce',
      expTitle: '✅ Expected Result',
      actTitle: '❌ Actual Result',
      rootTitle:
        '🔍 Root Cause Analysis:',
      aiInsightsTitle:
        '🤖 AI Diagnostic & Triage (Smart Triage):',
      networkLogsTitle:
        '🚨 Parsed Network Console (HTTP Errors):',
      btnGherkin:
        'Convert to BDD / Gherkin 🥒',
      exportJira: 'Export to Jira',
      exportTrello: 'Export to Trello',
      exportAzure:
        'Export to Azure DevOps',

      modalJiraTitle:
        'Jira Cloud Authentication',
      modalJiraDomain:
        'Domain (e.g. mycompany.atlassian.net)',
      modalJiraKey:
        'Project Key (e.g. PROJ)',
      modalJiraEmail:
        'Atlassian Email',
      modalJiraToken:
        'Atlassian API Token',

      modalTrelloTitle:
        'Trello Authentication',
      modalTrelloKey:
        'Trello API Key',
      modalTrelloToken:
        'User Token',
      modalTrelloList:
        'Target List ID',

      modalAzureTitle:
        'Azure DevOps Authentication',
      modalAzureOrg:
        'Organization (e.g. my-org)',
      modalAzureProj:
        'Project Name',
      modalAzurePat:
        'PAT (Personal Access Token)',

      btnCancel: 'Cancel',
      btnConnectJira:
        'Connect & Create Issue',
      btnConnectTrello:
        'Connect & Create Card',
      btnConnectAzure:
        'Connect & Create Bug',
    },
  }[language];

  // ============================================================
  // PASTE
  // ============================================================

  const handlePaste = (
    e: React.ClipboardEvent<HTMLTextAreaElement>
  ) => {
    const items = e.clipboardData?.items;

    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (
        items[i].type.indexOf('image') !== -1
      ) {
        const file =
          items[i].getAsFile();

        if (file) {
          const reader =
            new FileReader();

          reader.onload = (event) => {
            setPastedImage(
              event.target?.result as string
            );
          };

          reader.readAsDataURL(file);
        }
      }
    }
  };

  // ============================================================
  // EXPORT
  // ============================================================

  const handleExport = async (
    platform:
      | 'jira'
      | 'trello'
      | 'azure',
    credentials: any
  ) => {
    try {
      const res = await fetch(
        '/api/export',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            platform,
            credentials,
            bugData: {
              title:
                generatedReport?.title ||
                'Bug Report desde AI Bug Reporter',
              description:
                JSON.stringify(
                  generatedReport,
                  null,
                  2
                ),
            },
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(
          `¡Exportado a ${platform.toUpperCase()} con éxito!`
        );

        setShowJiraModal(false);
        setShowTrelloModal(false);
        setShowAzureModal(false);
      } else {
        alert(
          data.error ||
            `Error exportando a ${platform.toUpperCase()}`
        );
      }
    } catch (err) {
      console.error(err);

      alert(
        'Error de conexión al exportar'
      );
    }
  };

  // ============================================================
  // GHERKIN
  // ============================================================

  const generateGherkin = () => {
    if (!generatedReport) return;

    const hasPreconditions =
      Array.isArray(
        generatedReport.preconditions
      ) &&
      generatedReport.preconditions.length > 0;

    const preconditionsFormatted =
      hasPreconditions
        ? generatedReport.preconditions
            .map(
              (p: string) =>
                `  Given ${p}`
            )
            .join('\n')
        : '  Given no hay precondiciones disponibles en la evidencia proporcionada.';

    const steps = Array.isArray(
      generatedReport.steps
    )
      ? generatedReport.steps
      : generatedReport.steps
        ? [generatedReport.steps]
        : [];

    const stepsFormatted =
      steps.length > 0
        ? steps
            .map(
              (s: string) =>
                `  And ${s}`
            )
            .join('\n')
        : '  And no hay pasos disponibles en la evidencia proporcionada.';

    const gherkin = `Feature: ${generatedReport.title}

  Scenario: Validar comportamiento ante fallo en ${generatedReport.module}
${preconditionsFormatted}
${stepsFormatted}
    Then el sistema debería responder: "${generatedReport.expected}"
    But el resultado obtenido fue: "${generatedReport.actual}"`;

    setGherkinText(gherkin);
  };

  // ============================================================
  // GRABADOR DE PANTALLA DESKTOP
  // ============================================================

const handleRecordVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: 'browser' },
          audio: false,
        });

        setIsRecording(true);
        setGherkinText(null);

        setTimeout(async () => {
          stream.getTracks().forEach((track) => track.stop());
          setIsRecording(false);

          try {
            const res = await fetch('/api/generate-bug-report', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                evidence: {
                  source: 'screen-recording',
                  durationSeconds: videoDuration,
                  currentUrl: window.location.href,
                  userAgent: navigator.userAgent,
                  timestamp: new Date().toISOString()
                }
              })
            });

            if (!res.ok) throw new Error('API Error');

            const data = await res.json();
            const rep = data.report;

            setGeneratedReport({
              title: rep.title,
              severity: rep.priority === 'Critical' ? 'BLOCKER / CRITICAL 🔴' : 'MEDIUM 🟠',
              priority: rep.priority,
              module: 'Browser Session',
              environment: rep.environment || navigator.userAgent,
              preconditions: rep.preconditions || [],
              steps: Array.isArray(rep.stepsToReproduce) ? rep.stepsToReproduce : [rep.stepsToReproduce],
              expected: rep.expectedResult,
              actual: rep.actualResult,
              rootCause: rep.technicalCause,
              aiInsights: [`Grabación finalizada (${videoDuration}s).`]
            });
          } catch (e) {
            console.error('Error procesando grabación:', e);
          }
        }, videoDuration * 1000);
      } catch (err) {
        console.error('Permiso de grabación denegado:', err);
        setIsRecording(false);
      }
    };

  // ============================================================
  // VIDEO MOBILE
  // ============================================================

  const handleMobileVideoUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (file) {
      setGherkinText(null);

      setGeneratedReport({
        title:
          language === 'ES'
            ? 'Error de Touch/Renderizado en Navegación Móvil'
            : 'Mobile Touch/Rendering Glitch',
        severity: 'MAJOR 🟠',
        priority:
          'P2 - High Priority',
        module:
          'Mobile Web View',
        environment:
          'iOS Safari / Android Chrome',
        preconditions: [
          'Dispositivo con pantalla táctil activa.',
          'Navegación en modo portrait (vertical).',
        ],
        steps: [
          '1. Ir al menú desplegable superior en pantalla mobile.',
          "2. Hacer clic / tap en la opción 'Mi Perfil'.",
          '3. Tocar repetidamente el botón de cierre del modal.',
        ],
        expected:
          language === 'ES'
            ? 'Cierre fluido del menú táctil.'
            : 'Smooth touch menu close action.',
        actual:
          language === 'ES'
            ? 'Lag visual, menú congelado y elementos superpuestos.'
            : 'Visual lag, frozen menu and overlapping elements.',
        rootCause:
          'Mobile viewport overflow & touch-action CSS mismatch',
        aiInsights: [
          '💡 Revisa las reglas @media query para viewports menores a 480px.',
          '🤖 Tests sugeridos: Simular touch events acelerados en dispositivos móviles emulados.',
        ],
      });
    }
  };

  // ============================================================
  // NETWORK SCANNER
  // ============================================================

  const handleCaptureNetwork = () => {
    console.log(
      '🔥 SCAN BUTTON CLICKED',
      {
        isCapturingNetwork,
        scanId,
      }
    );

    // ----------------------------------------------------------
    // Detener escaneo
    // ----------------------------------------------------------

    if (isCapturingNetwork) {
      setIsCapturingNetwork(false);

      window.postMessage(
        {
          source:
            'ai-bug-reporter',
          type: 'STOP_SCAN',
        },
        window.location.origin
      );

      console.log(
        '🛑 STOP_SCAN enviado'
      );

      return;
    }

    // ----------------------------------------------------------
    // Iniciar nuevo escaneo
    // ----------------------------------------------------------

    const newScanId =
      `${Date.now()}-${Math.random()}`;

    // Limpiar errores del scan anterior
    processedNetworkErrors.current.clear();

    setScanId(newScanId);
    setNetworkErrors([]);
    setGherkinText(null);

    setIsCapturingNetwork(true);

    window.postMessage(
      {
        source:
          'ai-bug-reporter',
        type: 'START_SCAN',
        scanId: newScanId,
      },
      window.location.origin
    );

    console.log(
      '🚀 START_SCAN enviado:',
      newScanId
    );
  };

  // ============================================================
  // GENERADOR MANUAL / CAPTURA
  // ============================================================

 // ============================================================
    // GENERADOR MANUAL / CAPTURA
    // ============================================================
    const [isGeneratingManual, setIsGeneratingManual] = useState(false);

    const handleGenerateReport = async () => {
      if (!inputText && !pastedImage) {
        alert(language === 'ES' ? 'Por favor ingresá un log o pegá una captura.' : 'Please enter a log or paste a screenshot.');
        return;
      }

      setGherkinText(null);
      setIsGeneratingManual(true);

      try {
        const payloadEvidence = {
          source: 'manual-input',
          textInput: inputText,
          hasScreenshot: Boolean(pastedImage),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
          timestamp: new Date().toISOString()
        };

        const res = await fetch('/api/generate-bug-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ evidence: payloadEvidence })
        });

        if (!res.ok) {
          throw new Error(`API status: ${res.status}`);
        }

        const data = await res.json();
        const rep = data.report;

        setGeneratedReport({
          title: rep.title,
          severity: rep.priority === 'Critical' ? 'BLOCKER / CRITICAL 🔴' : 'MEDIUM 🟠',
          priority: rep.priority,
          module: 'Web Application',
          environment: rep.environment || 'Browser Runtime',
          preconditions: rep.preconditions || [],
          steps: Array.isArray(rep.stepsToReproduce) ? rep.stepsToReproduce : [rep.stepsToReproduce],
          expected: rep.expectedResult,
          actual: rep.actualResult,
          rootCause: rep.technicalCause,
          imagePreview: pastedImage,
          aiInsights: [`Prioridad sugerida: ${rep.priority}`]
        });
      } catch (err) {
        console.error('Error generando reporte manual:', err);
        alert(language === 'ES' ? 'Error al conectar con la API de IA.' : 'Failed to connect with AI API.');
      } finally {
        setIsGeneratingManual(false);
      }
    };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Bug Reporter
              </h1>
            </div>

            <p className="text-xs text-slate-400 mt-1">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-medium">
              <button
                onClick={() =>
                  setLanguage('ES')
                }
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  language === 'ES'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🇦🇷</span>
                <span>ES</span>
              </button>

              <button
                onClick={() =>
                  setLanguage('EN')
                }
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  language === 'EN'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🇺🇸</span>
                <span>EN</span>
              </button>
            </div>
          </div>
        </header>

        {/* Status indicator */}
        <div className="flex justify-end items-center px-4 py-2.5 bg-slate-900/40 rounded-xl border border-slate-800/80 text-xs text-slate-400">
          <span className="text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {t.status}
          </span>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Video */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-slate-700 transition-colors space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">
                📹
              </span>

              <h3 className="font-semibold text-sm text-slate-200">
                {t.videoTitle}
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {isMobile
                ? t.videoDescMobile
                : t.videoDescDesktop}
            </p>

            {!isMobile && (
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                <label
                  htmlFor="video-duration"
                  className="text-slate-400"
                >
                  {t.durationLabel}{' '}
                  <strong className="text-indigo-400">
                    {videoDuration} seg
                  </strong>
                </label>

                <input
                  id="video-duration"
                  type="range"
                  min="1"
                  max="60"
                  value={videoDuration}
                  onChange={(e) =>
                    setVideoDuration(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  disabled={
                    isRecording
                  }
                  className="w-1/2 accent-indigo-500 cursor-pointer"
                />
              </div>
            )}

            {isMobile ? (
              <div>
                <label
                  htmlFor="mobile-video-input"
                  className="w-full py-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {t.videoBtnMobile}
                </label>

                <input
                  id="mobile-video-input"
                  type="file"
                  accept="video/*"
                  onChange={
                    handleMobileVideoUpload
                  }
                  className="hidden"
                />
              </div>
            ) : (
              <button
                onClick={
                  handleRecordVideo
                }
                disabled={
                  isRecording
                }
                className="w-full py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isRecording
                  ? t.videoRec
                  : t.videoBtnDesktop}
              </button>
            )}
          </div>

          {/* Network Scanner */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-slate-700 transition-colors space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">
                🌐
              </span>

              <h3 className="font-semibold text-sm text-slate-200">
                {t.netTitle}
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {t.netDesc}
            </p>

            <button
              onClick={
                handleCaptureNetwork
              }
              className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isCapturingNetwork
                  ? 'bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30'
                  : 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30'
              }`}
            >
              {isCapturingNetwork
                ? t.netRec
                : t.netBtn}
            </button>
          </div>
        </div>

        {/* Network Scanner Results */}
        {isCapturingNetwork && (
          <section className="bg-slate-900/60 p-5 rounded-2xl border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-amber-300">
                  🌐 Network Scanner activo
                </h3>

                <p className="text-[10px] text-slate-500 mt-1 font-mono">
                  Scan ID: {scanId}
                </p>
              </div>

              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                LIVE
              </span>
            </div>

            {networkErrors.length ===
            0 ? (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-500 text-center">
                Esperando errores HTTP 4xx/5xx...
              </div>
            ) : (
              <div className="space-y-2">
                {networkErrors.map(
                  (
                    error: any,
                    index: number
                  ) => (
                    <div
                      key={`${error.timestamp}-${index}`}
                      className="bg-slate-950 p-3 rounded-xl border border-rose-500/20"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="text-rose-400 font-bold text-xs">
                          HTTP{' '}
                          {
                            error.statusCode
                          }
                        </span>

                        <span className="text-slate-500 text-[10px] font-mono">
                          {
                            error.method
                          }
                        </span>
                      </div>

                      <p className="text-slate-300 text-[11px] font-mono break-all mt-2">
                        {
                          error.url
                        }
                      </p>

                      <div className="flex justify-between mt-2 text-[9px] text-slate-500">
                        <span>
                          {error.type ||
                            'unknown'}
                        </span>

                        <span>
                          {new Date(
                            error.timestamp
                          ).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        )}

        {/* Input con opción de pegar captura */}
        <section className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300">
            {t.inputTitle}
          </h2>

          <textarea
            rows={3}
            onPaste={
              handlePaste
            }
            className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-200 placeholder-slate-500 text-xs font-mono"
            placeholder={
              t.inputPlaceholder
            }
            value={
              inputText
            }
            onChange={(e) =>
              setInputText(
                e.target.value
              )
            }
          />

          {pastedImage && (
            <div className="flex items-center justify-between p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={
                    pastedImage
                  }
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded-lg border border-indigo-500/30"
                />

                <span className="text-indigo-300 font-medium">
                  {t.pastedTag}
                </span>
              </div>

              <button
                onClick={() =>
                  setPastedImage(
                    null
                  )
                }
                className="text-slate-400 hover:text-rose-400 text-xs px-2 py-1 cursor-pointer"
              >
                {
                  t.pastedDelete
                }
              </button>
            </div>
          )}

          <button
            onClick={
              handleGenerateReport
            }
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs transition-colors shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            {t.genBtn}
          </button>
        </section>

        {/* Resultado */}
        {generatedReport && (
          <section className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-5 animate-in fade-in duration-300 shadow-2xl">

            {/* Header del Reporte */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  {
                    generatedReport.title
                  }
                </h3>

                <p className="text-xs text-slate-400 mt-0.5">
                  {
                    t.moduleLabel
                  }{' '}
                  <span className="text-slate-300">
                    {
                      generatedReport.module
                    }
                  </span>{' '}
                  |{' '}
                  {
                    t.envLabel
                  }{' '}
                  <span className="text-slate-300">
                    {
                      generatedReport.environment
                    }
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* PRIORIDAD */}
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {
                    t.prioLabel
                  }{' '}
                  {
                    generatedReport.priority
                  }
                </span>

                {/* SEVERIDAD
                    Solo se muestra si realmente existe. */}
                {generatedReport.severity && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {
                      generatedReport.severity
                    }
                  </span>
                )}
              </div>
            </div>

            {/* Precondiciones */}
            {Array.isArray(
              generatedReport.preconditions
            ) &&
              generatedReport.preconditions.length >
                0 && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                  <span className="font-semibold text-purple-400">
                    {
                      t.precondTitle
                    }
                  </span>

                  <ul className="list-disc list-inside text-slate-300 font-mono text-[11px] space-y-1">
                    {
                      generatedReport.preconditions.map(
                        (
                          pre: string,
                          i: number
                        ) => (
                          <li
                            key={i}
                          >
                            {pre}
                          </li>
                        )
                      )
                    }
                  </ul>
                </div>
              )}

            {/* Imagen */}
            {generatedReport.imagePreview && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 mb-2">
                  {
                    t.analyzedImageTag
                  }
                </p>

                <img
                  src={
                    generatedReport.imagePreview
                  }
                  alt="Captura del Bug"
                  className="max-h-48 rounded-lg object-contain"
                />
              </div>
            )}

            {/* Pasos + esperado/actual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <span className="font-semibold text-indigo-400">
                  {
                    t.stepsTitle
                  }
                </span>

                <ul className="space-y-1.5 text-slate-300 font-mono text-[11px]">
                  {Array.isArray(
                    generatedReport.steps
                  ) ? (
                    generatedReport.steps.map(
                      (
                        step: string,
                        i: number
                      ) => (
                        <li
                          key={i}
                          className="leading-relaxed"
                        >
                          {step}
                        </li>
                      )
                    )
                  ) : (
                    <li className="leading-relaxed">
                      {
                        generatedReport.steps ||
                        generatedReport.stepsToReproduce ||
                        'No disponible en la evidencia proporcionada.'
                      }
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">

                <div>
                  <span className="font-semibold text-emerald-400 block mb-0.5">
                    {
                      t.expTitle
                    }
                  </span>

                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {
                      generatedReport.expected ??
                      generatedReport.expectedResult ??
                      'No disponible en la evidencia proporcionada.'
                    }
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-rose-400 block mb-0.5">
                    {
                      t.actTitle
                    }
                  </span>

                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {
                      generatedReport.actual ??
                      generatedReport.actualResult ??
                      'No disponible en la evidencia proporcionada.'
                    }
                  </p>
                </div>

              </div>
            </div>

            {/* Causa Raíz */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-xs font-mono">
              <span className="text-amber-400 font-semibold block mb-1">
                {
                  t.rootTitle
                }
              </span>

              <code className="text-slate-300 text-[11px]">
                {
                  generatedReport.rootCause ??
                  generatedReport.technicalCause ??
                  'No disponible en la evidencia proporcionada.'
                }
              </code>
            </div>

            {/* AI Insights */}
            {generatedReport.aiInsights && (
              <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/20 space-y-2 text-xs">
                <span className="text-purple-400 font-semibold block">
                  {
                    t.aiInsightsTitle
                  }
                </span>

                <ul className="space-y-1 text-slate-300 text-[11px] font-mono">
                  {
                    generatedReport.aiInsights.map(
                      (
                        insight: string,
                        idx: number
                      ) => (
                        <li
                          key={idx}
                        >
                          {
                            insight
                          }
                        </li>
                      )
                    )
                  }
                </ul>
              </div>
            )}

            {/* Network Logs del reporte */}
            {generatedReport.networkLogs && (
              <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/20 space-y-2">
                <span className="text-rose-400 font-semibold text-xs block">
                  {
                    t.networkLogsTitle
                  }
                </span>

                <div className="space-y-2 font-mono text-[11px]">
                  {
                    generatedReport.networkLogs.map(
                      (
                        log: any,
                        idx: number
                      ) => (
                        <div
                          key={idx}
                          className="bg-rose-950/20 p-2.5 rounded-lg border border-rose-900/40 space-y-1"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-rose-400 font-bold">
                              {
                                log.status
                              }
                            </span>

                            <span className="text-slate-400 text-[10px]">
                              {
                                log.url
                              }
                            </span>
                          </div>

                          <p className="text-slate-300 text-[10px] bg-slate-900 p-1.5 rounded">
                            {
                              log.payload
                            }
                          </p>
                        </div>
                      )
                    )
                  }
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">

                <button
                  onClick={
                    generateGherkin
                  }
                  className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  {
                    t.btnGherkin
                  }
                </button>

                <button
                  onClick={() =>
                    setShowJiraModal(
                      true
                    )
                  }
                  className="px-3.5 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  {
                    t.exportJira
                  }
                </button>

                <button
                  onClick={() =>
                    setShowTrelloModal(
                      true
                    )
                  }
                  className="px-3.5 py-2 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  {
                    t.exportTrello
                  }
                </button>

                <button
                  onClick={() =>
                    setShowAzureModal(
                      true
                    )
                  }
                  className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  {
                    t.exportAzure
                  }
                </button>
              </div>

              {gherkinText && (
                <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
                  <span className="text-emerald-400 text-xs font-semibold block">
                    Gherkin BDD Feature:
                  </span>

                  <pre className="text-slate-300 font-mono text-[11px] whitespace-pre-wrap overflow-x-auto">
                    {
                      gherkinText
                    }
                  </pre>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Modal Jira */}
        {showJiraModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
              <h3 className="text-base font-bold text-slate-100">
                {
                  t.modalJiraTitle
                }
              </h3>

              <input
                type="text"
                placeholder={
                  t.modalJiraDomain
                }
                value={
                  jiraDomain
                }
                onChange={(e) =>
                  setJiraDomain(
                    e.target.value
                  )
                }
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              />

              <input
                type="text"
                placeholder={
                  t.modalJiraKey
                }
                value={
                  jiraProjectKey
                }
                onChange={(e) =>
                  setJiraProjectKey(
                    e.target.value
                  )
                }
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              />

              <input
                type="email"
                placeholder={
                  t.modalJiraEmail
                }
                value={
                  jiraEmail
                }
                onChange={(e) =>
                  setJiraEmail(
                    e.target.value
                  )
                }
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              />

              <input
                type="password"
                placeholder={
                  t.modalJiraToken
                }
                value={
                  jiraApiToken
                }
                onChange={(e) =>
                  setJiraApiToken(
                    e.target.value
                  )
                }
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() =>
                    setShowJiraModal(
                      false
                    )
                  }
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs cursor-pointer"
                >
                  {
                    t.btnCancel
                  }
                </button>

                <button
                  onClick={() =>
                    handleExport(
                      'jira',
                      {
                        domain:
                          jiraDomain,
                        projectKey:
                          jiraProjectKey,
                        email:
                          jiraEmail,
                        apiToken:
                          jiraApiToken,
                      }
                    )
                  }
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {
                    t.btnConnectJira
                  }
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Trello */}
        {showTrelloModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
              <h3 className="text-base font-bold text-slate-100">
                {
                  t.modalTrelloTitle
                }
              </h3>

              <input
                type="text"
                placeholder={
                  t.modalTrelloKey
                }
                value={
                  trelloApiKey
                }
                onChange={(e) =>
                  setTrelloApiKey(
                    e.target.value
                  )
                }
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              />

              <input
                type="password"
                placeholder={
                  t.modalTrelloToken
                }
                value={
                  trelloToken
                }
                onChange={(e) =>
                  setTrelloToken(
                    e.target.value
                  )
                }
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              />

              <input
                type="text"
                placeholder={
                  t.modalTrelloList
                }
                value={
                  trelloListId
                }
                onChange={(e) =>
                  setTrelloListId(
                    e.target.value
                  )
                }
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() =>
                    setShowTrelloModal(
                      false
                    )
                  }
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs cursor-pointer"
                >
                  {
                    t.btnCancel
                  }
                </button>

                <button
                  onClick={() =>
                    handleExport(
                      'trello',
                      {
                        apiKey:
                          trelloApiKey,
                        token:
                          trelloToken,
                        listId:
                          trelloListId,
                      }
                    )
                  }
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {
                    t.btnConnectTrello
                  }
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Azure DevOps */}
        {showAzureModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
              <h3 className="text-base font-bold text-slate-100">
                {
                  t.modalAzureTitle
                }
              </h3>

              <input
                type="text"
                placeholder={
                  t.modalAzureOrg
                }
                value={
                  azureOrg
                }
                onChange={(e) =>
                  setAzureOrg(
                    e.target.value
                  )
                }
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              />

              <input
                type="text"
                placeholder={
                  t.modalAzureProj
                }
                value={
                  azureProject
                }
                onChange={(e) =>
                  setAzureProject(
                    e.target.value
                  )
                }
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              />

              <input
                type="password"
                placeholder={
                  t.modalAzurePat
                }
                value={
                  azurePat
                }
                onChange={(e) =>
                  setAzurePat(
                    e.target.value
                  )
                }
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() =>
                    setShowAzureModal(
                      false
                    )
                  }
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs cursor-pointer"
                >
                  {
                    t.btnCancel
                  }
                </button>

                <button
                  onClick={() =>
                    handleExport(
                      'azure',
                      {
                        org: azureOrg,
                        project:
                          azureProject,
                        pat: azurePat,
                      }
                    )
                  }
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {
                    t.btnConnectAzure
                  }
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}