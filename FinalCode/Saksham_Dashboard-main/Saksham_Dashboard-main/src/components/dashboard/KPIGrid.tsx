import { KPICard } from './KPICard';
import { mockKPIs } from '../../data/mockData';

export const KPIGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
      {mockKPIs.map((kpi) => (
        <KPICard key={kpi.id} {...kpi} />
      ))}
    </div>
  );
};

