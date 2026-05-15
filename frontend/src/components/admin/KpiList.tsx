import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useTranslation } from 'react-i18next';
import { useKpiConfigs, useReorderKpiConfigs, useUpdateKpiConfig } from '../../api/admin';
import type { KpiConfig } from '../../types';

interface KpiListProps {
  onSelect: (kpi: KpiConfig) => void;
  selectedId: number | null;
}

export function KpiList({ onSelect, selectedId }: KpiListProps) {
  const { t } = useTranslation();
  const { data: configs = [], isLoading } = useKpiConfigs();
  const reorder = useReorderKpiConfigs();
  const update  = useUpdateKpiConfig();

  const [items, setItems] = useState<KpiConfig[]>([]);
  const sorted = items.length ? items : [...configs].sort((a, b) => a.ordem - b.ordem);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(sorted);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setItems(reordered);
    reorder.mutate(reordered.map((item, i) => ({ id: item.id, ordem: i + 1 })));
  };

  if (isLoading) return <div className="skeleton" style={{ height: 300 }} />;

  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="flex items-center justify-between mb-4">
        <h3>{t('admin.title')}</h3>
      </div>
      <p className="text-xs text-muted mb-4">{t('admin.subtitle')}</p>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="kpi-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sorted.map((kpi, index) => (
                <Draggable key={kpi.id} draggableId={String(kpi.id)} index={index}>
                  {(drag) => (
                    <div
                      ref={drag.innerRef}
                      {...drag.draggableProps}
                      id={`kpi-list-item-${kpi.id}`}
                      className={`kpi-list-item${selectedId === kpi.id ? ' selected' : ''}`}
                      onClick={() => onSelect(kpi)}
                    >
                      <span {...drag.dragHandleProps} className="kpi-list-item__drag" title="Arrastar">⠿</span>
                      <span className={`kpi-list-item__status kpi-list-item__status--${kpi.visivel ? 'on' : 'off'}`} />
                      <span className="kpi-list-item__name truncate">{kpi.titulo}</span>
                      <span className="kpi-list-item__type">{kpi.tipo}</span>
                      <button
                        className="btn btn--ghost btn--sm"
                        title={kpi.visivel ? t('admin.deactivate') : t('admin.activate')}
                        onClick={(e) => {
                          e.stopPropagation();
                          update.mutate({ id: kpi.id, payload: { visivel: !kpi.visivel } });
                        }}
                      >
                        {kpi.visivel ? '👁' : '🙈'}
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
