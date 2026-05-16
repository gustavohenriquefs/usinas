import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as Switch from '@radix-ui/react-switch';
import { toast } from 'sonner';
import { useUpdateKpiConfig } from '../../api/admin';
import type { KpiConfig } from '../../types';

interface KpiEditorProps {
  kpi: KpiConfig | null;
}

export function KpiEditor({ kpi }: KpiEditorProps) {
  const { t } = useTranslation();
  const update = useUpdateKpiConfig();

  const [form, setForm] = useState({
    titulo:      '',
    descricao:   '',
    visivel:     true,
    config_json: '{}',
  });
  const [jsonError, setJsonError] = useState('');

  // Sync form when KPI selection changes
  useEffect(() => {
    if (!kpi) return;
    setForm({
      titulo:      kpi.titulo,
      descricao:   kpi.descricao ?? '',
      visivel:     kpi.visivel,
      config_json: JSON.stringify(kpi.config_json, null, 2),
    });
    setJsonError('');
  }, [kpi]);

  // Toast on save success / error
  useEffect(() => {
    if (update.isSuccess) toast.success(t('admin.saved'));
  }, [update.isSuccess, t]);

  useEffect(() => {
    if (update.isError) toast.error(t('common.error'));
  }, [update.isError, t]);

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

  const validateJson = (value: string): boolean => {
    try {
      JSON.parse(value);
      setJsonError('');
      return true;
    } catch {
      setJsonError(t('admin.invalidJson'));
      return false;
    }
  };

  const handleJsonChange = (value: string) => {
    setForm((f) => ({ ...f, config_json: value }));
    if (jsonError) validateJson(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateJson(form.config_json)) return;
    update.mutate({
      id: kpi.id,
      payload: {
        titulo:      form.titulo,
        descricao:   form.descricao || undefined,
        visivel:     form.visivel,
        config_json: JSON.parse(form.config_json),
      },
    });
  };

  const isPending = update.isPending;

  return (
    <div className="card" id="kpi-editor">
      <h3 style={{ marginBottom: 20 }}>{t('admin.editorTitle')}</h3>

      <form onSubmit={handleSubmit} noValidate>
        {/* Slug — read-only */}
        <div className="form-group">
          <label className="form-label" htmlFor="editor-slug">
            {t('admin.fields.slug')}
          </label>
          <input
            id="editor-slug"
            className="form-input"
            value={kpi.slug}
            readOnly
            aria-readonly="true"
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
          />
        </div>

        {/* Título */}
        <div className="form-group">
          <label className="form-label" htmlFor="editor-titulo">
            {t('admin.fields.title')}{' '}
            <span aria-hidden="true" style={{ color: 'var(--accent-red)' }}>*</span>
          </label>
          <input
            id="editor-titulo"
            className="form-input"
            value={form.titulo}
            required
            minLength={2}
            maxLength={100}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
        </div>

        {/* Descrição */}
        <div className="form-group">
          <label className="form-label" htmlFor="editor-descricao">
            {t('admin.fields.description')}
          </label>
          <input
            id="editor-descricao"
            className="form-input"
            value={form.descricao}
            maxLength={200}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
        </div>

        {/* Visível — Radix Switch */}
        <div className="form-group">
          <label className="form-label" htmlFor="editor-visivel">
            {t('admin.fields.visible')}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Switch.Root
              id="editor-visivel"
              checked={form.visivel}
              onCheckedChange={(checked) => setForm({ ...form, visivel: checked })}
              className="switch-root"
            >
              <Switch.Thumb className="switch-thumb" />
            </Switch.Root>
            <span style={{ fontSize: '0.8125rem', color: form.visivel ? 'var(--accent-green)' : 'var(--text-muted)' }}>
              {form.visivel ? t('common.yes') : t('common.no')}
            </span>
          </div>
        </div>

        {/* Config JSON */}
        <div className="form-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label className="form-label" htmlFor="editor-config-json" style={{ margin: 0 }}>
              {t('admin.fields.configJson')}
            </label>
            <span className="json-help-trigger" tabIndex={0} aria-label={t('admin.jsonHelp.title')}>
              <span className="json-help-icon">ⓘ</span>
              <div className="json-help-popover" role="tooltip">
                <p className="json-help-title">{t('admin.jsonHelp.title')}</p>
                <p className="json-help-desc">{t('admin.jsonHelp.desc')}</p>
                <table className="json-help-table">
                  <thead>
                    <tr>
                      <th>{t('admin.jsonHelp.fieldCol')}</th>
                      <th>{t('admin.jsonHelp.typeCol')}</th>
                      <th>{t('admin.jsonHelp.descCol')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td><code>cor</code></td><td>string</td><td>{t('admin.jsonHelp.corDesc')}</td></tr>
                    <tr><td><code>unidade</code></td><td>string</td><td>{t('admin.jsonHelp.unidadeDesc')}</td></tr>
                    <tr><td><code>meta</code></td><td>number</td><td>{t('admin.jsonHelp.metaDesc')}</td></tr>
                    <tr><td><code>decimais</code></td><td>number</td><td>{t('admin.jsonHelp.decimaisDesc')}</td></tr>
                  </tbody>
                </table>
                <p className="json-help-example-label">{t('admin.jsonHelp.example')}:</p>
                <pre className="json-help-pre">{`{\n  "cor": "#10B981",\n  "unidade": "TWh",\n  "meta": 95,\n  "decimais": 1\n}`}</pre>
              </div>
            </span>
          </div>
          <textarea
            id="editor-config-json"
            className="form-textarea"
            value={form.config_json}
            aria-invalid={!!jsonError}
            aria-describedby={jsonError ? 'json-error-msg' : undefined}
            onChange={(e) => handleJsonChange(e.target.value)}
            onBlur={(e) => validateJson(e.target.value)}
          />
          {jsonError && (
            <span id="json-error-msg" role="alert" style={{ color: 'var(--accent-red)', fontSize: '0.75rem' }}>
              {jsonError}
            </span>
          )}
        </div>

        {/* Submit */}
        <button
          id="editor-save"
          type="submit"
          className="btn btn--primary"
          disabled={isPending || !!jsonError}
          aria-busy={isPending}
        >
          {isPending ? (
            <>
              <svg
                aria-hidden="true"
                width="14" height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ animation: 'spin 0.7s linear infinite', verticalAlign: 'middle', marginRight: 6 }}
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              {t('admin.saving')}
            </>
          ) : t('admin.saveKpi')}
        </button>
      </form>
    </div>
  );
}
