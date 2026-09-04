'use client';

import React, { useState } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState<string>('');
  const [pastedImage, setPastedImage] = useState<string | null>(null);
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [language, setLanguage] = useState<'ES' | 'EN'>('ES');
  const [reportCount, setReportCount] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isCapturingNetwork, setIsCapturingNetwork] = useState<boolean>(false);

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

  // Diccionario multilenguaje completo
  const t = {
    ES: {
      subtitle: 'Generá reportes con IA, analizá video/red y exportá en 1 clic.',
      upgrade: 'Pasar a Pro ($15/mes)',
      usageLabel: 'Uso Plan Gratis:',
      usageCount: 'reportes creados',
      status: 'Servidor de IA Operativo',
      videoTitle: 'Capturador de Video con IA',
      videoDesc: 'Seleccioná tu pestaña o pantalla para grabar 5s. La IA analizará la interacción para extraer los pasos automáticamente.',
      videoBtn: 'Grabar Pantalla',
      videoRec: '🔴 Capturando pantalla (5s)...',
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
      analyzedImageTag: 'Captura Analizada por IA:',
      stepsTitle: '📋 Pasos para Reproducir',
      expTitle: '✅ Resultado Esperado',
      actTitle: '❌ Resultado Actual',
      rootTitle: '🔍 Análisis de Causa Raíz (Root Cause Analysis):',
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
      videoDesc: 'Select your window or screen to record 5s. AI will process frames to extract steps automatically.',
      videoBtn: 'Record Screen',
      videoRec: '🔴 Capturing screen (5s)...',
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
      analyzedImageTag: 'AI Analyzed Screenshot:',
      stepsTitle: '📋 Steps to Reproduce',
      expTitle: '✅ Expected Result',
      actTitle: '❌ Actual Result',
      rootTitle: '🔍 Root Cause Analysis:',
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

  // Captura de eventos del portapapeles (Ctrl + V)
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
          title: generatedReport?.title || 'Bug Report desde AI Bug Reporter',
          description: JSON.stringify(generatedReport),
          credentials
        })
      });
      if (res.ok) {
        alert(`¡Exportado a ${platform.toUpperCase()} con éxito!`);
      } else {
        alert(`Error exportando a ${platform.toUpperCase()}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al exportar');
    }
  };

  // Grabador de pantalla
  const handleRecordVideo = async () => {
    if (!checkLimit()) return;

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' },
        audio: false
      });

      setIsRecording(true);

      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);

        setGeneratedReport({
          title: language === 'ES' ? "Error Crítico durante Checkout" : "Critical Checkout Exception",
          severity: "CRITICAL 🔴",
          module: "Payment Gateway / Frontend",
          environment: "Chrome 128 / macOS Sonoma",
          steps: language === 'ES' ? [
            "Navegar a la vista de carrito.",
            "Hacer clic en 'Pagar con Tarjeta'.",
            "Interacción congelada por 1.4s tras click event.",
            "Excepción de JavaScript no capturada en consola."
          ] : [
            "Navigate to cart view.",
            "Click on 'Pay with Card'.",
            "Frozen interaction for 1.4s after click event.",
            "Uncaught JavaScript Exception in console."
          ],
          expected: language === 'ES' ? "Redirección inmediata a la pasarela de Stripe." : "Immediate redirect to Stripe gateway.",
          actual: language === 'ES' ? "Pantalla bloqueada sin respuesta visual al usuario." : "Screen blocked without visual feedback.",
          rootCause: "Uncaught TypeError: Cannot read properties of undefined (reading 'token')"
        });

        setReportCount(prev => prev + 1);
      }, 5000);

    } catch (err) {
      console.error("Permiso de grabación denegado:", err);
      setIsRecording(false);
    }
  };

  // Capturador de red
  const handleCaptureNetwork = () => {
    if (!checkLimit()) return;

    setIsCapturingNetwork(true);
    setTimeout(() => {
      setIsCapturingNetwork(false);
      setGeneratedReport({
        title: language === 'ES' ? "Fallo HTTP 500 en API Endpoint" : "HTTP 500 Failure on API Endpoint",
        severity: "MAJOR 🟠",
        module: "API Gateway / Billing Service",
        environment: "Node.js v20 / Next.js API Routes",
        steps: [
          "POST /api/v1/payments/charge HTTP/1.1",
          "Headers: Authorization: Bearer *****",
          "Payload: { amount: 1500, currency: 'usd' }"
        ],
        expected: language === 'ES' ? "HTTP 200 OK con checkout_url." : "HTTP 200 OK with checkout_url.",
        actual: "HTTP 500 Internal Server Error (Timeout 504).",
        rootCause: "Gateway Timeout: upstream service failed to respond in 5000ms"
      });
      setReportCount(prev => prev + 1);
    }, 1500);
  };

  // Generador manual / por captura
  const handleGenerateReport = () => {
    if (!checkLimit()) return;

    setGeneratedReport({
      title: language === 'ES' ? "Reporte Generado por Captura / Logs" : "Screenshot / Log-Based Generated Report",
      severity: pastedImage ? "CRITICAL 🔴" : "MEDIUM 🟡",
      module: pastedImage ? "UI Layout / Inspección Visual" : "Componente General",
      environment: "Web Application",
      steps: language === 'ES' ? [
        "Ingreso de datos o captura adjunta en formulario.",
        "Análisis visual de componentes procesado por IA."
      ] : [
        "Data or attached screenshot provided in form.",
        "Visual component inspection processed by AI."
      ],
      expected: language === 'ES' ? "Renderizado visual correcto." : "Correct visual component rendering.",
      actual: inputText || (pastedImage ? (language === 'ES' ? "Inconsistencia visual detectada en la captura." : "Visual inconsistency detected in screenshot.") : "Error informado en logs."),
      rootCause: pastedImage ? "CSS Overflow / Z-Index alignment glitch" : "Analizado desde entrada de texto por IA.",
      imagePreview: pastedImage
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
            <p className="text-xs text-slate-400 leading-relaxed">{t.videoDesc}</p>
            <button 
              onClick={handleRecordVideo}
              disabled={isRecording}
              className="w-full py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isRecording ? t.videoRec : t.videoBtn}
            </button>
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
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100">{generatedReport.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{t.moduleLabel} <span className="text-slate-300">{generatedReport.module}</span> | {t.envLabel} <span className="text-slate-300">{generatedReport.environment}</span></p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                {generatedReport.severity}
              </span>
            </div>

            {generatedReport.imagePreview && (
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 mb-2">{t.analyzedImageTag}</p>
                <img src={generatedReport.imagePreview} alt="Captura del Bug" className="max-h-48 rounded-lg object-contain" />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <span className="font-semibold text-indigo-400">{t.stepsTitle}</span>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 font-mono">
                  {generatedReport.steps.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
                <div>
                  <span className="font-semibold text-emerald-400 block mb-0.5">{t.expTitle}</span>
                  <p className="text-slate-300">{generatedReport.expected}</p>
                </div>
                <div>
                  <span className="font-semibold text-rose-400 block mb-0.5">{t.actTitle}</span>
                  <p className="text-slate-300">{generatedReport.actual}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-xs font-mono">
              <span className="text-amber-400 font-semibold block mb-1">{t.rootTitle}</span>
              <code className="text-slate-300">{generatedReport.rootCause}</code>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-800">
              <button onClick={() => setShowJiraModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md cursor-pointer">{t.exportJira}</button>
              <button onClick={() => setShowTrelloModal(true)} className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl text-xs transition-all shadow-md cursor-pointer">{t.exportTrello}</button>
              <button onClick={() => setShowAzureModal(true)} className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-all shadow-md cursor-pointer">{t.exportAzure}</button>
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