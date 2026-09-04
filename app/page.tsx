'use client';

import React, { useState } from 'react';

export default function Home() {
  const [log, setLog] = useState('');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!log.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/generate-bug-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ log }),
      });
      const data = await response.json();
      setReport(data.report || 'No se pudo generar el reporte.');
    } catch (error) {
      console.error(error);
      setReport('Ocurrió un error al conectar con la API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-white">AI Bug Reporter</h1>
          <span className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-500/20">
            QA Pro
          </span>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Pegá el log de error o detalles de la captura:
            </label>
            <textarea
              className="w-full h-40 p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              placeholder="Paste raw error log, console traceback, or context..."
              value={log}
              onChange={(e) => setLog(e.target.value)}
          <script>
            const handlePaste = async (event) => {
              const items = event.clipboardData.items;
              for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.type.startsWith('image/')) {
                  const file = item.getAsFile();
                  const base64 = await getBase64(file);
                  setLog((prev) => prev + base64 + '\n'); // Append the Base64 image
                }
              }
            };
          </script>
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Generando Reporte...' : 'Generar Reporte de Bug'}
          </button>
        </form>

        {report && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 space-y-3">
            <h2 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2">
              Reporte Generado:
            </h2>
            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 bg-slate-900/50 p-4 rounded-md border border-slate-800 overflow-x-auto">
              {report}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}