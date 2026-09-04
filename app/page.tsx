'use client';

import { useState } from 'react';

export default function Home() {
  const [log, setLog] = useState('');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePaste = async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const base64 = await getBase64(file);
          setLog((prev) => prev + base64 + '\n');
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!log.trim()) return;

    setLoading(true);
    setReport('');

    try {
      const res = await fetch('/api/generate-bug-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ log }),
      });

      const data = await res.json();
      if (res.ok) {
        setReport(data.report);
      } else {
        setReport(`Error: ${data.error || 'No se pudo generar el reporte'}`);
      }
    } catch (err) {
      setReport('Error de conexión al generar el reporte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">AI Bug Reporter</h1>
            <p className="text-slate-400 text-sm mt-1">
              Transformá logs e imágenes en reportes de errores estructurados para QA y Devs.
            </p>
          </div>
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
              className="w-full h-40 p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Paste raw error log, console traceback, or context..."
              value={log}
              onChange={(e) => setLog(e.target.value)}
              onPaste={handlePaste}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generando Reporte...' : 'Generar Bug Report'}
          </button>
        </form>

        {report && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Resultado del Reporte</h2>
            <div className="whitespace-pre-wrap font-mono text-sm text-slate-300 bg-slate-900 p-4 rounded border border-slate-800">
              {report}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}