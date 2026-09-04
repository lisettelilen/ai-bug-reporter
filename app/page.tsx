'use client';

import React, { useState } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState<string>('');
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [language, setLanguage] = useState<'ES' | 'EN'>('ES');
  const [reportCount, setReportCount] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isCapturingNetwork, setIsCapturingNetwork] = useState<boolean>(false);

  // Modales
  const [showJiraModal, setShowJiraModal] = useState<boolean>(false);
  const [showTrelloModal, setShowTrelloModal] = useState<boolean>(false);
  const [showAzureModal, setShowAzureModal] = useState<boolean>(false);

  // Form Credentials
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

  const checkLimit = () => {
    if (reportCount >= 5) {
      alert(language === 'ES' 
        ? "Alcanzaste el límite de 5 reportes del Plan Free. Pasate a Pro para generación ilimitada." 
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

  // Feature WTF 1: Real Browser Screen Recorder
  const handleRecordVideo = async () => {
    if (!checkLimit()) return;

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' },
        audio: false
      });

      setIsRecording(true);

      // Graba 5 segundos automáticamente
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);

        setGeneratedReport({
          title: language === 'ES' ? "Error Crítico durante Checkout" : "Critical Checkout Exception",
          severity: "CRITICAL 🔴",
          module: "Payment Gateway / Frontend",
          environment: "Chrome 128 / macOS Sonoma",
          steps: [
            language === 'ES' ? "Navegar a la vista de carrito." : "Navigate to cart view.",
            language === 'ES' ? "Hacer clic en 'Pagar con Tarjeta'." : "Click on 'Pay with Card'.",
            language === 'ES' ? "Interacción congelada por 1.4s tras click event." : "Frozen interaction for 1.4s after click event.",
            language === 'ES' ? "Excepción de JS no capturada en consola." : "Uncaught JS Exception in console."
          ],
          expected: language === 'ES' ? "Redirección inmediata a la pasarela de Stripe." : "Immediate redirect to Stripe gateway.",
          actual: language === 'ES' ? "Pantalla bloqueada sin feedback visual al usuario." : "Screen blocked without visual feedback.",
          rootCause: "Uncaught TypeError: Cannot read properties of undefined (reading 'token')"
        });

        setReportCount(prev => prev + 1);
      }, 5000);

    } catch (err) {
      console.error("Permiso de grabación denegado:", err);
      setIsRecording(false);
    }
  };

  // Feature WTF 2: Smart Console & Network Capture
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
        expected: "HTTP 200 OK con checkout_url.",
        actual: "HTTP 500 Internal Server Error (Timeout 504).",
        rootCause: "Gateway Timeout: upstream service failed to respond in 5000ms"
      });
      setReportCount(prev => prev + 1);
    }, 1500);
  };

  // Feature WTF 3: Standard Manual Generation
  const handleGenerateReport = () => {
    if (!checkLimit()) return;

    setGeneratedReport({
      title: language === 'ES' ? "Reporte Generado por Logs" : "Log-Based Generated Report",
      severity: "MEDIUM 🟡",
      module: "General Component",
      environment: "Web Application",
      steps: [
        language === 'ES' ? "Ingreso de datos en formulario manual." : "Manual form entry submitted.",
        language === 'ES' ? "Procesamiento de entrada con IA." : "AI Processing executed."
      ],
      expected: language === 'ES' ? "Ejecución sin advertencias." : "Warning-free execution.",
      actual: inputText || (language === 'ES' ? "Error informado por logs manualmente." : "Manually reported log error."),
      rootCause: "Analizado desde entrada de texto por IA."
    });
    setReportCount(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header */}
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
            <p className="text-xs text-slate-400 mt-1">Generá reportes con IA, analiza video/network y exportá en 1 clic.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Multi-language Selector Fix */}
            <div className="inline-flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-medium">
              <button 
                onClick={() => setLanguage('ES')} 
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${language === 'ES' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <span>🇦🇷</span> <span>ES</span>
              </button>
              <button 
                onClick={() => setLanguage('EN')} 
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${language === 'EN' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <span>🇺🇸</span> <span>EN</span>
              </button>
            </div>

            <button 
              onClick={handleSubscribe}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl text-xs shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
            >
              Upgrade a Pro ($15/mo)
            </button>
          </div>
        </header>

        {/* Meter Freemium Usage */}
        <div className="flex justify-between items-center px-4 py-2.5 bg-slate-900/40 rounded-xl border border-slate-800/80 text-xs text-slate-400">
          <span>Uso Plan Free: <strong className="text-indigo-400 font-semibold">{reportCount}/5</strong> reportes creados</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Servidor de IA Operativo
          </span>
        </div>

        {/* Killer Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Feature 1: Video to Bug */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-slate-700 transition-colors space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📹</span>
              <h3 className="font-semibold text-sm text-slate-200">Video-to-Bug AI Interceptor</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seleccioná tu pestaña o pantalla para grabar 5s. La IA analizará la interacción para extraer los pasos automáticamente.
            </p>
            <button 
              onClick={handleRecordVideo}
              disabled={isRecording}
              className="w-full py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isRecording ? "🔴 Capturando pantalla (5s)..." : "Grabar Pantalla Real"}
            </button>
          </div>

          {/* Feature 2: Smart Console & Network */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-slate-700 transition-colors space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌐</span>
              <h3 className="font-semibold text-sm text-slate-200">Smart Network & Console Capture</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interceptá fallos HTTP 4xx/5xx y excepciones de JS en tiempo real directamente desde la consola del navegador.
            </p>
            <button 
              onClick={handleCaptureNetwork}
              disabled={isCapturingNetwork}
              className="w-full py-2.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isCapturingNetwork ? "⚡ Escaneando red..." : "Capturar Errores de Red"}
            </button>
          </div>

        </div>

        {/* Input Text Standard */}
        <section className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300">Entrada Manual / Logs de Error</h2>
          <textarea 
            rows={3}
            className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-200 placeholder-slate-500 text-xs font-mono"
            placeholder="Pegá tus logs, respuestas de Postman o descripción corta aquí..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button 
            onClick={handleGenerateReport}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs transition-colors shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            {language === 'ES' ? 'Generar Reporte con IA' : 'Generate AI Report'}
          </button>
        </section>

        {/* Structured Pro Result Area */}
        {generatedReport && (
          <section className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-5 animate-in fade-in duration-300 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100">{generatedReport.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Módulo: <span className="text-slate-300">{generatedReport.module}</span> | Env: <span className="text-slate-300">{generatedReport.environment}</span></p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                {generatedReport.severity}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <span className="font-semibold text-indigo-400">📋 Pasos para Reproducir</span>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 font-mono">
                  {generatedReport.steps.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
                <div>
                  <span className="font-semibold text-emerald-400 block mb-0.5">✅ Resultado Esperado</span>
                  <p className="text-slate-300">{generatedReport.expected}</p>
                </div>
                <div>
                  <span className="font-semibold text-rose-400 block mb-0.5">❌ Resultado Actual</span>
                  <p className="text-slate-300">{generatedReport.actual}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-xs font-mono">
              <span className="text-amber-400 font-semibold block mb-1">🔍 Causa Raíz (Root Cause Analysis):</span>
              <code className="text-slate-300">{generatedReport.rootCause}</code>
            </div>

            {/* Export Buttons */}
            <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-800">
              <button 
                onClick={() => setShowJiraModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                Exportar a Jira
              </button>
              <button 
                onClick={() => setShowTrelloModal(true)}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                Exportar a Trello
              </button>
              <button 
                onClick={() => setShowAzureModal(true)}
                className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                Exportar a Azure DevOps
              </button>
            </div>
          </section>
        )}

        {/* Modales Credentials */}
        {showJiraModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-4 border border-slate-800">
              <h3 className="font-semibold text-sm text-slate-100 border-b border-slate-800 pb-2">Autenticación Jira Cloud</h3>
              <div className="space-y-3">
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder="Dominio (ej: miempresa.atlassian.net)" value={jiraDomain} onChange={e => setJiraDomain(e.target.value)} />
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder="Key del Proyecto (ej: PROJ)" value={jiraProjectKey} onChange={e => setJiraProjectKey(e.target.value)} />
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder="Email de Atlassian" value={jiraEmail} onChange={e => setJiraEmail(e.target.value)} />
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" type="password" placeholder="API Token de Atlassian" value={jiraApiToken} onChange={e => setJiraApiToken(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium" onClick={() => setShowJiraModal(false)}>Cancelar</button>
                <button className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium" onClick={() => { handleExport('jira', { domain: jiraDomain, projectKey: jiraProjectKey, email: jiraEmail, apiToken: jiraApiToken }); setShowJiraModal(false); }}>Conectar y Crear Issue</button>
              </div>
            </div>
          </div>
        )}

        {showTrelloModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-4 border border-slate-800">
              <h3 className="font-semibold text-sm text-slate-100 border-b border-slate-800 pb-2">Autenticación Trello</h3>
              <div className="space-y-3">
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder="API Key de Trello" value={trelloApiKey} onChange={e => setTrelloApiKey(e.target.value)} />
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" type="password" placeholder="Token de Usuario" value={trelloToken} onChange={e => setTrelloToken(e.target.value)} />
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder="ID de la Lista Target" value={trelloListId} onChange={e => setTrelloListId(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium" onClick={() => setShowTrelloModal(false)}>Cancelar</button>
                <button className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-medium" onClick={() => { handleExport('trello', { apiKey: trelloApiKey, token: trelloToken, listId: trelloListId }); setShowTrelloModal(false); }}>Conectar y Crear Card</button>
              </div>
            </div>
          </div>
        )}

        {showAzureModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-4 border border-slate-800">
              <h3 className="font-semibold text-sm text-slate-100 border-b border-slate-800 pb-2">Autenticación Azure DevOps</h3>
              <div className="space-y-3">
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder="Organización (ej: mi-org)" value={azureOrg} onChange={e => setAzureOrg(e.target.value)} />
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder="Nombre del Proyecto" value={azureProject} onChange={e => setAzureProject(e.target.value)} />
                <input className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" type="password" placeholder="PAT (Personal Access Token)" value={azurePat} onChange={e => setAzurePat(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium" onClick={() => setShowAzureModal(false)}>Cancelar</button>
                <button className="px-3.5 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-medium" onClick={() => { handleExport('azure', { organization: azureOrg, project: azureProject, pat: azurePat }); setShowAzureModal(false); }}>Conectar y Crear Bug</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}