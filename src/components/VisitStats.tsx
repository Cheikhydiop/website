// components/VisitStats.tsx
import React from 'react';
import { getVisitStats, getTrafficSources } from '../services/analyticsQueries';

interface VisitStatsProps {
  timeRange: string;
}

export const VisitStats: React.FC<VisitStatsProps> = ({ timeRange }) => {
  const [stats, setStats] = React.useState<any>(null);
  const [sources, setSources] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadStats();
  }, [timeRange]);

  const loadStats = async () => {
    const [statsData, sourcesData] = await Promise.all([
      getVisitStats(timeRange),
      getTrafficSources(timeRange)
    ]);
    
    setStats(statsData.data);
    setSources(sourcesData.data);
  };

  if (!stats) return <div>Chargement...</div>;

  return (
    <div className="visit-stats">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Visites Total</h3>
          <div className="stat-value">{stats.total_visits}</div>
        </div>
        
        <div className="stat-card">
          <h3>Visiteurs Uniques</h3>
          <div className="stat-value">{stats.unique_visitors}</div>
        </div>
        
        <div className="stat-card">
          <h3>Visites Moyennes</h3>
          <div className="stat-value">{stats.avg_visits_per_visitor}</div>
        </div>
      </div>

      <div className="traffic-sources">
        <h3>Sources de Traffic</h3>
        <div className="sources-list">
          {sources.map((source, index) => (
            <div key={source.source} className="source-item">
              <span className="source-name">{source.source}</span>
              <span className="source-count">{source.count}</span>
              <div 
                className="source-bar"
                style={{ width: `${(source.count / Math.max(...sources.map(s => s.count))) * 100}%` }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      <div className="popular-pages">
        <h3>Pages Populaires</h3>
        <div className="pages-list">
          {stats.popular_pages.map((page: any) => (
            <div key={page.path} className="page-item">
              <span className="page-path">{page.path}</span>
              <span className="page-count">{page.count} visites</span>
              <span className="page-percentage">{page.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};