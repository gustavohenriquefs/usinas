import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdateKpiConfig, useDeleteKpiConfig } from '../../api/admin';
import type { KpiConfig, KpiTipo } from '../../types';

interface KpiEditorProps {
  kpi: KpiConfig | null;
}

const KPI_TYPES: KpiTipo[] = ['card', 'line', 'bar', 'area', 'donut'];

export function KpiEditor({ kpi }: KpiEditorProps) {
  const { t } = useTranslation();
  const update = useUpdateKpiConfig();
  const remove = useDeleteKpiConfig();

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    tipo: 'line' as KpiTipo,
    endpoint_path: '',
    visivel: true,
    config_json: '{}',
  });
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    if (!kpi) return;
    setForm({
      titulo:        kpi.titulo,
      descricao:     kpi.descricao ?? '',
      tipo:          kpi.tipo,
      endpoint_path: kpi.endpoint_path,
      visivel:       kpi.visivel,
      config_json:   JSON.stringify(kpi.config_json, null, 2),
    });
    setJsonError('');
  }, [kpi]);

  if (!kpi) {
    return (
      <div className="card">
        <div className="empty-state">
          <span className="empty-state__icon">⚙️</span>
          <p>{t('admin.editorEmpty')}</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    try {
      const parsed = JSON.parse(form.config_json);
      update.mutate({ id: kpi.id, payload: { ...form, config_json: parsed } });
      setJsonError('');
    } catch {
      setJsonError('JSON inválido');
    }
  };

  return (
    <div className="card" id="kpi-editor">
      <h3 style={{ marginBottom: 20 }}>{t('admin.editorTitle')}</h3>

      <div className="form-group">
        <label className="form-label">{t('admin.fields.slug')}</label>
        <input className="form-input" value={kpi.slug} readOnly style={{ opacity: 0.5 }} />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="editor-titulo">{t('admin.fields.title')}</label>
        <input
          id="editor-titulo"
          className="form-input"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="editor-descricao">{t('admin.fields.description')}</label>
        <input
          id="editor-descricao"
          className="form-input"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="form-group">
          <label className="form-label" htmlFor="editor-tipo">{t('admin.fields.type')}</label>
          <select
            id="editor-tipo"
            className="form-select"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value as KpiTipo })}
          >
            {KPI_TYPES.map((tp) => (
              <option key={tp} value={tp}>{t(`admin.types.${tp}`)}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{t('admin.fields.visible')}</label>
          <div className="toggle-group" style={{ width: 'fit-content' }}>
            <button
              id="editor-visivel-sim"
              className={`toggle-btn${form.visivel ? ' active' : ''}`}
              onClick={() => setForm({ ...form, visivel: true })}
            >{t('common.yes')}</button>
            <button
              id="editor-visivel-nao"
              className={`toggle-btn${!form.visivel ? ' active' : ''}`}
              onClick={() => setForm({ ...form, visivel: false })}
            >{t('common.no')}</button>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="editor-endpoint">{t('admin.fields.endpoint')}</label>
        <input
          id="editor-endpoint"
          className="form-input font-mono"
          value={form.endpoint_path}
          onChange={(e) => setForm({ ...form, endpoint_path: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="editor-config-json">{t('admin.fields.configJson')}</label>
        <textarea
          id="editor-config-json"
          className="form-textarea"
          value={form.config_json}
          onChange={(e) => setForm({ ...form, config_json: e.target.value })}
        />
        {jsonError && <span style={{ color: 'var(--accent-red)', fontSize: '0.75rem' }}>{jsonError}</span>}
      </div>

      <div className="flex gap-2">
        <button id="editor-save" className="btn btn--primary" onClick={handleSave}>
          {update.isPending ? '...' : t('admin.saveKpi')}
        </button>
        <button
          id="editor-delete"
          className="btn btn--danger"
          onClick={() => remove.mutate(kpi.id)}
        >
          {t('admin.delete')}
        </button>
      </div>
    </div>
  );
}
