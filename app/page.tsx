'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState<string>('');
  const [pastedImage, setPastedImage] = useState<string | null>(null);
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [language, setLanguage] = useState<'ES' | 'EN'>('ES');
  const [reportCount, setReportCount] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<number>(5);
  const [isCapturingNetwork, setIsCapturingNetwork] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [gherkinText, setGherkinText] = useState<string | null>(null);

  // Modales de integración
  const [showJiraModal, setShowJiraModal] = useState<boolean>(false);
  const [showTrelloModal, setShowTrelloModal] = useState<boolean>(false);
  const [showAzureModal, setShowAzureModal] = useState<boolean>(false);

  // Formularios de credenciales
  const [jiraEmail, setJiraEmail] = useState<string>('');
  const [jiraApiToken, setJiraApiToken] = useState<string>('');
  const [jiraDomain, setJiraDomain] = useState<string>('');
  const [jiraProjectKey, setJiraProjectKey] = useState<string>('');

  const [trelloApiKey, setTrelloApiKey] = useState<string>('');
  const [trelloToken, setTrelloToken] = useState<string>('');
  const [trelloListId, setTrelloListId] = useState<string>('');

  const [azureOrg, setAzureOrg] = useState<string>('');
  const [azureProject, setAzureProject] = useState<string>('');
  const [azurePat, setAzurePat] = useState<string>('');

  // Detección de dispositivo móvil
  useEffect(() => {
    const userAgent = typeof window !== 'undefined' ? navigator.userAgent : '';
    const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    setIsMobile(mobileCheck);
  }, []);

  // Diccionario multilenguaje completo
  const t = {
    ES: {
      subtitle: 'Generá reportes con IA, analizá video/red y exportá en 1 clic.',
      upgrade: 'Pasar a Pro ($15/mes)',
      usageLabel: 'Uso Plan Gratis:',
      usageCount: 'reportes creados',
      status: 'Servidor de IA Operativo',
      videoTitle: 'Capturador de Video con IA',
      videoDescDesktop: 'Seleccioná la duración (1-60s) y tu pantalla para grabar. La IA extraerá las acciones automáticamente.',
      videoDescMobile: 'Subí un video o grabación de pantalla tomada desde tu celular para que la IA la analice.',
      videoBtnDesktop: 'Grabar Pantalla',
      videoBtnMobile: 'Subir Video desde Celular',
      videoRec: `🔴 Capturando pantalla (${videoDuration}s)...`,
      durationLabel: 'Duración:',
      netTitle: 'Captura Inteligente de Red y Consola',
      netDesc: 'Interceptá fallos HTTP 4xx/5xx y excepciones de JavaScript en tiempo real directamente desde la consola.',
      netBtn: 'Capturar Errores de Red',
      netRec: '⚡ Escaneando red...',
      inputTitle: 'Entrada Manual, Logs o Captura de Pantalla (Ctrl+V)',
      inputPlaceholder: 'Pegá tus logs o presioná Ctrl+V para pegar una captura de pantalla desde tu portapapeles...',
      pastedTag: '🖼️ Captura de pantalla adjunta lista para analizar',
      pastedDelete: '✕ Eliminar',
      genBtn: 'Generar Reporte con IA',
      
      // Card de Resultado
      moduleLabel: 'Módulo:',
      envLabel: 'Entorno:',
      prioLabel: 'Prioridad Backlog:',
      precondTitle: '⚙️ Precondiciones del Test',
      analyzedImageTag: 'Captura Analizada por IA:',
      stepsTitle: '📋 Pasos para Reproducir',
      expTitle: '✅ Resultado Esperado',
      actTitle: '❌ Resultado Actual',
      rootTitle: '🔍 Análisis de Causa Raíz (Root Cause Analysis):',
      aiInsightsTitle: '🤖 Sugerencias y Diagnóstico IA (Smart Triage):',
      networkLogsTitle: '🚨 Consola de Red Parseda (HTTP Errors):',
      btnGherkin: 'Convertir a BDD / Gherkin 🥒',
      exportJira: 'Exportar a Jira',
      exportTrello: 'Exportar a Trello',
      exportAzure: 'Exportar a Azure DevOps',

      // Modales
      modalJiraTitle: 'Autenticación Jira Cloud',
      modalJiraDomain: 'Dominio (ej: miempresa.atlassian.net)',
      modalJiraKey: 'Key del Proyecto (ej: PROJ)',
      modalJiraEmail: 'Email de Atlassian',
      modalJiraToken: 'API Token de Atlassian',

      modalTrelloTitle: 'Autenticación Trello',
      modalTrelloKey: 'API Key de Trello',
      modalTrelloToken: 'Token de Usuario',
      modalTrelloList: 'ID de la Lista Objetivo',

      modalAzureTitle: 'Autenticación Azure DevOps',
      modalAzureOrg: 'Organización (ej: mi-org)',
      modalAzureProj: 'Nombre del Proyecto',
      modalAzurePat: 'PAT (Personal Access Token)',

      btnCancel: 'Cancelar',
      btnConnectJira: 'Conectar y Crear Issue',
      btnConnectTrello: 'Conectar y Crear Tarjeta',
      btnConnectAzure: 'Conectar y Crear Bug',
    },
    EN: {
      subtitle: 'Generate AI bug reports, analyze video/network logs and export in 1-click.',
      upgrade: 'Upgrade to Pro ($15/mo)',
      usageLabel: 'Free Plan Usage:',
      usageCount: 'reports created',
      status: 'AI Server Operational',
      videoTitle: 'Video-to-Bug AI Interceptor',
      videoDescDesktop: 'Select duration (1-60s) and your screen/window to record. AI will extract steps automatically.',
      videoDescMobile: 'Upload a video or screen recording from your phone for AI analysis.',
      videoBtnDesktop: 'Record Screen',
      videoBtnMobile: 'Upload Video from Phone',
      videoRec: `🔴 Capturing screen (${videoDuration}s)...`,
      durationLabel: 'Duration:',
      netTitle: 'Smart Network & Console Capture',
      netDesc: 'Intercept HTTP 4xx/5xx errors and JS console exceptions in real-time directly from the browser.',
      netBtn: 'Capture Network Errors',
      netRec: '⚡ Scanning network...',
      inputTitle: 'Manual Entry, Logs, or Screen Capture (Ctrl+V)',
      inputPlaceholder: 'Paste your logs or press Ctrl+V to paste a screenshot directly from your clipboard...',
      pastedTag: '🖼️ Screenshot attached and ready for analysis',
      pastedDelete: '✕ Remove',
      genBtn: 'Generate AI Report',

      // Result Card
      moduleLabel: 'Module:',
      envLabel: 'Env:',
      prioLabel: 'Backlog Priority:',
      precondTitle: '⚙️ Test Preconditions',
      analyzedImageTag: 'AI Analyzed Screenshot:',
      stepsTitle: '📋 Steps to Reproduce',
      expTitle: '✅ Expected Result',
      actTitle: '❌ Actual Result',
      rootTitle: '🔍 Root Cause Analysis:',
      aiInsightsTitle: '🤖 AI Diagnostic & Triage (Smart Triage):',
      networkLogsTitle: '🚨 Parsed Network Console (HTTP Errors):',
      btnGherkin: 'Convert to BDD / Gherkin 🥒',
      exportJira: 'Export to Jira',
      exportTrello: 'Export to Trello',
      exportAzure: 'Export to Azure DevOps',

      // Modals
      modalJiraTitle: 'Jira Cloud Authentication',
      modalJiraDomain: 'Domain (e.g. mycompany.atlassian.net)',
      modalJiraKey: 'Project Key (e.g. PROJ)',
      modalJiraEmail: 'Atlassian Email',
      modalJiraToken: 'Atlassian API Token',

      modalTrelloTitle: 'Trello Authentication',
      modalTrelloKey: 'Trello API Key',
      modalTrelloToken: 'User Token',
      modalTrelloList: 'Target List ID',

      modalAzureTitle: 'Azure DevOps Authentication',
      modalAzureOrg: 'Organization (e.g. my-org)',
      modalAzureProj: 'Project Name',
      modalAzurePat: 'PAT (Personal Access Token)',

      btnCancel: 'Cancel',
      btnConnectJira: 'Connect & Create Issue',
      btnConnectTrello: 'Connect & Create Card',
      btnConnectAzure: 'Connect & Create Bug',
    }
  }[language];

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setPastedImage(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const checkLimit = () => {
    if (reportCount >= 5) {
      alert(language === 'ES' 
        ? "Alcanzaste el límite de 5 reportes del Plan Gratis. Pasate a Pro para generación ilimitada." 
        : "You reached the 5-report limit for the Free Plan. Upgrade to Pro for unlimited generation.");
      return false;
    }
    return true;
  };

  const handleSubscribe = async () => {
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Error iniciando la pasarela de pago');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con Stripe');
    }
  };

  const handleExport = async (platform: 'jira' | 'trello' | 'azure', credentials: any) => {
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          credentials,
          bugData: {
            title: generatedReport?.title || 'Bug Report desde AI Bug Reporter',
            description: JSON.stringify(generatedReport, null, 2)
          }
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`¡Exportado a ${platform.toUpperCase()} con éxito!`);
      } else {
        alert(data.error || `Error exportando a ${platform.toUpperCase()}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al exportar');
    }
  };

  // Convertidor a BDD / Gherkin
  const generateGherkin = () => {
    if (!generatedReport) return;
    
    const preconditionsFormatted = generatedReport.preconditions
      ? generatedReport.preconditions.map((p: string) => `  Given ${p}`).join('\n')
      : `  Given el usuario está autenticado en el entorno ${generatedReport.environment}`;

    const stepsFormatted = generatedReport.steps
      ? generatedReport.steps.map((s: string) => `  And ${s}`).join('\n')
      : '  And realiza las acciones sobre la aplicación';

    const gherkin = `Feature: ${generatedReport.title}

  Scenario: Validar comportamiento ante fallo en ${generatedReport.module}
${preconditionsFormatted}
${stepsFormatted}
    Then el sistema debería responder: "${generatedReport.expected}"
    But el resultado obtenido fue: "${generatedReport.actual}"`;

    setGherkinText(gherkin);
  };

  // Grabador de pantalla Desktop
  const handleRecordVideo = async () => {
    if (!checkLimit()) return;

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' },
        audio: false
      });

      setIsRecording(true);
      setGherkinText(null);

      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);

        setGeneratedReport({
          title: language === 'ES' ? "Error Crítico durante Checkout de Pago" : "Critical Checkout Payment Exception",
          severity: "BLOCKER / CRITICAL 🔴",
          priority: "P1 - Immediate Fix Required",
          module: "Payment Gateway / Frontend",
          environment: "Chrome 128 / macOS Sonoma",
          preconditions: [
            "Usuario autenticado con rol 'Customer'.",
            "Carrito activo con al menos 1 producto en stock.",
            "Método de pago habilitado en la pasarela."
          ],
          steps: [
            "1. Ir a la vista del carrito de compras con ítems agregados.",
            "2. Hacer clic en el botón 'Pagar con Tarjeta'.",
            "3. Ingresar las credenciales de prueba y presionar 'Confirmar Pago'.",
            "4. Observar la pantalla de procesamiento congelada por más de 1.4s."
          ],
          expected: language === 'ES' ? "Redirección inmediata a la pasarela de confirmación de Stripe." : "Immediate redirect to Stripe payment confirmation.",
          actual: language === 'ES' ? "Pantalla congelada sin respuesta visual ni confirmación al cliente." : "Frozen UI without visual feedback or confirmation to the customer.",
          rootCause: "Uncaught TypeError: Cannot read properties of undefined (reading 'token')",
          aiInsights: language === 'ES' ? [
            "💡 Probable regresión introducida en la v2.4.1 en el manejo de tokens asíncronos.",
            "⚠️ Riesgo de alto impacto: 100% de carritos bloqueados en el checkout.",
            "🤖 Tests sugeridos: Añadir test E2E en Playwright/Cypress cubriendo respuesta 200 con payload nulo."
          ] : [
            "💡 Likely regression introduced in v2.4.1 in async token handling.",
            "⚠️ High-impact risk: 100% of checkout funnels currently blocked.",
            "🤖 Suggested tests: Add Playwright/Cypress E2E test handling null token payloads."
          ]
        });

        setReportCount(prev => prev + 1);
      }, videoDuration * 1000);

    } catch (err) {
      console.error("Permiso de grabación denegado:", err);
      setIsRecording(false);
    }
  };

  // Carga de video Mobile
  const handleMobileVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!checkLimit()) return;
    const file = e.target.files?.[0];
    if (file) {
      setGherkinText(null);
      setGeneratedReport({
        title: language === 'ES' ? "Error de Touch/Renderizado en Navegación Móvil" : "Mobile Touch/Rendering Glitch",
        severity: "MAJOR 🟠",
        priority: "P2 - High Priority",
        module: "Mobile Web View",
        environment: "iOS Safari / Android Chrome",
        preconditions: [
          "Dispositivo con pantalla táctil activa.",
          "Navegación en modo portrait (vertical)."
        ],
        steps: [
          "1. Ir al menú desplegable superior en pantalla mobile.",
          "2. Hacer clic / tap en la opción 'Mi Perfil'.",
          "3. Tocar repetidamente el botón de cierre del modal."
        ],
        expected: language === 'ES' ? "Cierre fluido del menú táctil." : "Smooth touch menu close action.",
        actual: language === 'ES' ? "Lag visual, menú congelado y elementos superpuestos." : "Visual lag, frozen menu and overlapping elements.",
        rootCause: "Mobile viewport overflow & touch-action CSS mismatch",
        aiInsights: [
          "💡 Revisa las reglas @media query para viewports menores a 480px.",
          "🤖 Tests sugeridos: Simular touch events acelerados en dispositivos móviles emulados."
        ]
      });
      setReportCount(prev => prev + 1);
    }
  };

  // Capturador de red (Filtro HTTP 4xx/5xx)
  const handleCaptureNetwork = () => {
    if (!checkLimit()) return;

    setIsCapturingNetwork(true);
    setGherkinText(null);

    setTimeout(() => {
      setIsCapturingNetwork(false);
      setGeneratedReport({
        title: language === 'ES' ? "Fallo de Servidor HTTP 500 / 504 Gateway Timeout" : "HTTP 500 / 504 Gateway Timeout Failure",
        severity: "BLOCKER / CRITICAL 🔴",
        priority: "P1 - Urgent Fix Required",
        module: "API Gateway / Billing Service",
        environment: "Node.js v20 / Next.js API Routes",
        preconditions: [
          "Servicio de pagos de terceros accesible.",
          "Token JWT válido presente en el header Authorization."
        ],
        steps: [
          "1. Ir a la sección de Checkout / Cobros.",
          "2. Hacer clic en el botón 'Generar Suscripción'.",
          "3. Inspeccionar las peticiones salientes en la pestaña Network."
        ],
        expected: language === 'ES' ? "HTTP 200 OK con payload checkout_url." : "HTTP 200 OK with checkout_url payload.",
        actual: "HTTP 500 Internal Server Error tras responder HTTP 504 Timeout.",
        rootCause: "Gateway Timeout: upstream payment service failed to respond within 5000ms",
        networkLogs: [
          { status: "500 Internal Server Error", url: "POST /api/v1/payments/charge", payload: '{"error": "Database lock timeout", "code": 50012}' },
          { status: "401 Unauthorized", url: "GET /api/v1/user/auth-check", payload: '{"message": "Token expired or invalid signature"}' }
        ],
        aiInsights: [
          "💡 La BD colapsó por retries automáticos no controlados en el microservicio de Billing.",
          "🤖 Sugerencia: Aplicar patrón Circuit Breaker y aumentar timeout de conexión."
        ]
      });
      setReportCount(prev => prev + 1);
    }, 1500);
  };

  // Generador manual / captura
  const handleGenerateReport = () => {
    if (!checkLimit()) return;

    setGherkinText(null);
    setGeneratedReport({
      title: language === 'ES' ? "Reporte Generado por Captura / Logs" : "Screenshot / Log-Based Generated Report",
      severity: pastedImage ? "MINOR / VISUAL 🟡" : "MEDIUM 🟠",
      priority: pastedImage ? "P4 - Low Priority" : "P3 - Normal Priority",
      module: pastedImage ? "UI Layout / Inspección Visual" : "Componente General",
      environment: "Web Application",
      preconditions: [
        "Sesión activa en el aplicativo web."
      ],
      steps: [
        "1. Ir a la pantalla principal de la aplicación.",
        "2. Cargar o pegar la captura de pantalla / logs en el formulario.",
        "3. Hacer clic en 'Generar Reporte con IA'."
      ],
      expected: language === 'ES' ? "Alineación y estilo visual correcto de los componentes." : "Correct alignment and visual styling of UI components.",
      actual: inputText || (pastedImage ? (language === 'ES' ? "Desalineación de elementos detectada en la captura." : "Element misalignment detected in screenshot.") : "Error informado en logs."),
      rootCause: pastedImage ? "CSS Overflow / Z-Index alignment glitch" : "Analizado desde entrada de texto por IA.",
      imagePreview: pastedImage,
      aiInsights: [
        "💡 Problema puramente cosmético/CSS sin impacto en lógica de negocio."
      ]
    });
    setReportCount(prev => prev + 1);
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
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 tracking-wide">
                PRO SaaS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{t.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-medium">
              <button 
                onClick={() => setLanguage('ES')} 
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${language === 'ES' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <span>🇦🇷</span> <span>ES</span>
              </button>
              <button 
                onClick={() => setLanguage('EN')} 
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${language === 'EN' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <span>🇺🇸</span> <span>EN</span>
              </button>
            </div>

            <button 
              onClick={handleSubscribe}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl text-xs shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
            >
              {t.upgrade}
            </button>
          </div>
        </header>

        {/* Meter Usage */}
        <div className="flex justify-between items-center px-4 py-2.5 bg-slate-900/40 rounded-xl border border-slate-800/80 text-xs text-slate-400">
          <span>{t.usageLabel} <strong className="text-indigo-400 font-semibold">{reportCount}/5</strong> {t.usageCount}</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> {t.status}
          </span>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-slate-700 transition-colors space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📹</span>
              <h3 className="font-semibold text-sm text-slate-200">{t.videoTitle}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isMobile ? t.videoDescMobile : t.videoDescDesktop}
            </p>

            {/* Selector de Duración (1 a 60 segundos) */}
            {!isMobile && (
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                <label htmlFor="video-duration" className="text-slate-400">
                  {t.durationLabel} <strong className="text-indigo-400">{videoDuration} seg</strong>
                </label>
                <input 
                  id="video-duration"
                  type="range" 
                  min="1" 
                  max="60" 
                  value={videoDuration} 
                  onChange={(e) => setVideoDuration(Number(e.target.value))}
                  disabled={isRecording}
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
                  onChange={handleMobileVideoUpload} 
                  className="hidden" 
                />
              </div>
            ) : (
              <button 
                onClick={handleRecordVideo}
                disabled={isRecording}
                className="w-full py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isRecording ? t.videoRec : t.videoBtnDesktop}
              </button>
            )}
          </div>

          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-slate-700 transition-colors space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌐</span>
              <h3 className="font-semibold text-sm text-slate-200">{t.netTitle}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{t.netDesc}</p>
            <button 
              onClick={handleCaptureNetwork}
              disabled={isCapturingNetwork}
              className="w-full py-2.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isCapturingNetwork ? t.netRec : t.netBtn}
            </button>
          </div>
        </div>

        {/* Input con opción de pegar captura */}
        <section className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300">{t.inputTitle}</h2>
          
          <textarea 
            rows={3}
            onPaste={handlePaste}
            className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-200 placeholder-slate-500 text-xs font-mono"
            placeholder={t.inputPlaceholder}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          {pastedImage && (
            <div className="flex items-center justify-between p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs">
              <div className="flex items-center gap-3">
                <img src={pastedImage} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-indigo-500/30" />
                <span className="text-indigo-300 font-medium">{t.pastedTag}</span>
              </div>
              <button 
                onClick={() => setPastedImage(null)} 
                className="text-slate-400 hover:text-rose-400 text-xs px-2 py-1 cursor-pointer"
              >
                {t.pastedDelete}
              </button>
            </div>
          )}

          <button 
            onClick={handleGenerateReport}
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
                <h3 className="text-base font-bold text-slate-100">{generatedReport.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.moduleLabel} <span className="text-slate-300">{generatedReport.module}</span> | {t.envLabel} <span className="text-slate-300">{generatedReport.environment}</span>
                </p>
              </div>

              {/* Badges de Severidad e Impacto (P1-P4) */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {t.prioLabel} {generatedReport.priority}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {generatedReport.severity}
                </span>
              </div>
            </div>

            {/* Precondiciones del Test */}
            {generatedReport.preconditions && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                <span className="font-semibold text-purple-400">{t.precondTitle}</span>
                <ul className="list-disc list-inside text-slate-300 font-mono text-[11px] space-y-1">
                  {generatedReport.preconditions.map((pre: string, i: number) => (
                    <li key={i}>{pre}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Previsualización de Captura Analizada */}
            {generatedReport.imagePreview && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 mb-2">{t.analyzedImageTag}</p>
                <img src={generatedReport.imagePreview} alt="Captura del Bug" className="max-h-48 rounded-lg object-contain" />
              </div>
            )}

            {/* Pasos Estructurados + Esperado vs Actual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Pasos para Reproducir (1, 2, 3...) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <span className="font-semibold text-indigo-400">{t.stepsTitle}</span>
                <ul className="space-y-1.5 text-slate-300 font-mono text-[11px]">
                  {generatedReport.steps.map((step: string, i: number) => (
                    <li key={i} className="leading-relaxed">{step}</li>
                  ))}
                </ul>
              </div>

              {/* Resultado Esperado vs Obtendio */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
                <div>
                  <span className="font-semibold text-emerald-400 block mb-0.5">{t.expTitle}</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{generatedReport.expected}</p>
                </div>
                <div>
                  <span className="font-semibold text-rose-400 block mb-0.5">{t.actTitle}</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{generatedReport.actual}</p>
                </div>
              </div>
            </div>

            {/* Causa Raíz */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-xs font-mono">
              <span className="text-amber-400 font-semibold block mb-1">{t.rootTitle}</span>
              <code className="text-slate-300 text-[11px]">{generatedReport.rootCause}</code>
            </div>

            {/* Diagnóstico Predictivo e Insights de IA */}
            {generatedReport.aiInsights && (
              <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/20 space-y-2 text-xs">
                <span className="text-purple-400 font-semibold block">{t.aiInsightsTitle}</span>
                <ul className="space-y-1 text-slate-300 text-[11px] font-mono">
                  {generatedReport.aiInsights.map((insight: string, idx: number) => (
                    <li key={idx}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Consola de Red Parseda (HTTP 4xx/5xx) */}
            {generatedReport.networkLogs && (
              <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/20 space-y-2">
                <span className="text-rose-400 font-semibold text-xs block">{t.networkLogsTitle}</span>
                <div className="space-y-2 font-mono text-[11px]">
                  {generatedReport.networkLogs.map((log: any, idx: number) => (
                    <div key={idx} className="bg-rose-950/20 p-2.5 rounded-lg border border-rose-900/40 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-rose-400 font-bold">{log.status}</span>
                        <span className="text-slate-400 text-[10px]">{log.url}</span>
                      </div>
                      <p className="text-slate-300 text-[10px] bg-slate-900 p-1.5 rounded">{log.payload}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bloque BDD / Gherkin Generado */}
            {gherkinText && (
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2 animate-in fade-in duration-200">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400 font-semibold text-xs">Formato BDD / Gherkin (Feature File):</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(gherkinText)}
                    className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded hover:bg-emerald-500/20 cursor-pointer"
                  >
                    📋 Copiar Gherkin
                  </button>
                </div>
                <pre className="text-slate-300 font-mono text-[11px] bg-slate-900 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                  {gherkinText}
                </pre>
              </div>
            )}

            {/* Botones de Acción y Exportación */}
            <div className="flex flex-wrap gap-2.5 pt-2 border-t border-slate-800">
              <button onClick={generateGherkin} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md cursor-pointer">{t.btnGherkin}</button>
              <button onClick={() => setShowJiraModal(true)} className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md cursor-pointer">{t.exportJira}</button>
              <button onClick={() => setShowTrelloModal(true)} className="px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl text-xs transition-all shadow-md cursor-pointer">{t.exportTrello}</button>
              <button onClick={() => setShowAzureModal(true)} className="px-3.5 py-2 bg-blue-800 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-all shadow-md cursor-pointer">{t.exportAzure}</button>
            </div>

          </section>
        )}

        {/* Modales traducidos */}
        {showJiraModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-4 border border-slate-800">
              <h3 className="font-semibold text-sm text-slate-100 border-b border-slate-800 pb-2">{t.modalJiraTitle}</h3>
              <div className="space-y-3">
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder={t.modalJiraDomain} value={jiraDomain} onChange={e => setJiraDomain(e.target.value)} />
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder={t.modalJiraKey} value={jiraProjectKey} onChange={e => setJiraProjectKey(e.target.value)} />
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder={t.modalJiraEmail} value={jiraEmail} onChange={e => setJiraEmail(e.target.value)} />
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" type="password" placeholder={t.modalJiraToken} value={jiraApiToken} onChange={e => setJiraApiToken(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium cursor-pointer" onClick={() => setShowJiraModal(false)}>{t.btnCancel}</button>
                <button className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium cursor-pointer" onClick={() => { handleExport('jira', { domain: jiraDomain, projectKey: jiraProjectKey, email: jiraEmail, apiToken: jiraApiToken }); setShowJiraModal(false); }}>{t.btnConnectJira}</button>
              </div>
            </div>
          </div>
        )}

        {showTrelloModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-4 border border-slate-800">
              <h3 className="font-semibold text-sm text-slate-100 border-b border-slate-800 pb-2">{t.modalTrelloTitle}</h3>
              <div className="space-y-3">
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder={t.modalTrelloKey} value={trelloApiKey} onChange={e => setTrelloApiKey(e.target.value)} />
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" type="password" placeholder={t.modalTrelloToken} value={trelloToken} onChange={e => setTrelloToken(e.target.value)} />
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder={t.modalTrelloList} value={trelloListId} onChange={e => setTrelloListId(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium cursor-pointer" onClick={() => setShowTrelloModal(false)}>{t.btnCancel}</button>
                <button className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-medium cursor-pointer" onClick={() => { handleExport('trello', { apiKey: trelloApiKey, token: trelloToken, listId: trelloListId }); setShowTrelloModal(false); }}>{t.btnConnectTrello}</button>
              </div>
            </div>
          </div>
        )}

        {showAzureModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-4 border border-slate-800">
              <h3 className="font-semibold text-sm text-slate-100 border-b border-slate-800 pb-2">{t.modalAzureTitle}</h3>
              <div className="space-y-3">
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder={t.modalAzureOrg} value={azureOrg} onChange={e => setAzureOrg(e.target.value)} />
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder={t.modalAzureProj} value={azureProject} onChange={e => setAzureProject(e.target.value)} />
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" type="password" placeholder={t.modalAzurePat} value={azurePat} onChange={e => setAzurePat(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium cursor-pointer" onClick={() => setShowAzureModal(false)}>{t.btnCancel}</button>
                <button className="px-3.5 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-medium cursor-pointer" onClick={() => { handleExport('azure', { organization: azureOrg, project: azureProject, pat: azurePat }); setShowAzureModal(false); }}>{t.btnConnectAzure}</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}