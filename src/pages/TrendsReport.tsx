import { useState, useEffect } from 'react';
import { analyticsQueries } from '../services/analyticsQueries';
import Header from '../components/Header';
import './TrendsReport.css';

interface TrendData {
  period: string;
  new_leads: number;
  contacted: number;
  qualified: number;
  converted: number;
}

const TrendsReport = () => {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y'>('6m');

  useEffect(() => {
    loadTrends();
  }, [timeRange]);

  const loadTrends = async () => {
    setLoading(true);
    const { data } = await analyticsQueries.getMonthlyTrends();

    const limitedData = timeRange === '3m' ? data.slice(-3) :
                        timeRange === '6m' ? data.slice(-6) :
                        data.slice(-12);

    setTrends(limitedData || []);
    setLoading(false);
  };

  const calculateGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getPrediction = () => {
    if (trends.length < 3) return null;

    const recentTrends = trends.slice(-3);
    const avgGrowth = recentTrends.reduce((acc, trend, idx) => {
      if (idx === 0) return 0;
      return acc + calculateGrowthRate(trend.new_leads, recentTrends[idx - 1].new_leads);
    }, 0) / 2;

    const lastValue = trends[trends.length - 1].new_leads;
    const prediction = Math.round(lastValue * (1 + avgGrowth / 100));

    return {
      value: prediction,
      growth: avgGrowth,
      confidence: avgGrowth > 0 ? 'positive' : avgGrowth < 0 ? 'negative' : 'stable'
    };
  };

  const prediction = getPrediction();

  const formatMonth = (monthKey: string): string => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="trends-report">
        <Header />
        <div className="loading-state">
          <div className="loader"></div>
          <p>Chargement des tendances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trends-report">
      <Header />

      <section className="trends-section">
        <div className="container">
          <div className="trends-header">
            <div>
              <h1>Rapports de <span className="gradient-text">Tendances</span></h1>
              <p>Analyse pr\u00e9dictive et \u00e9volution des leads</p>
            </div>

            <div className="header-actions">
              <a href="/admin/analytics" className="btn-back">
                <i className="fas fa-arrow-left"></i>
                Retour
              </a>

              <div className="time-filter">
                <button
                  className={timeRange === '3m' ? 'active' : ''}
                  onClick={() => setTimeRange('3m')}
                >
                  3 Mois
                </button>
                <button
                  className={timeRange === '6m' ? 'active' : ''}
                  onClick={() => setTimeRange('6m')}
                >
                  6 Mois
                </button>
                <button
                  className={timeRange === '1y' ? 'active' : ''}
                  onClick={() => setTimeRange('1y')}
                >
                  1 An
                </button>
              </div>
            </div>
          </div>

          {prediction && (
            <div className="prediction-card">
              <div className="prediction-header">
                <i className="fas fa-chart-line"></i>
                <h3>Pr\u00e9vision Mois Prochain</h3>
              </div>
              <div className="prediction-content">
                <div className="prediction-value">
                  <span className="value">{prediction.value}</span>
                  <span className="label">Leads pr\u00e9vus</span>
                </div>
                <div className={`prediction-indicator ${prediction.confidence}`}>
                  <i className={`fas ${prediction.growth > 0 ? 'fa-arrow-up' : prediction.growth < 0 ? 'fa-arrow-down' : 'fa-minus'}`}></i>
                  <span>{Math.abs(prediction.growth).toFixed(1)}%</span>
                </div>
              </div>
              <p className="prediction-note">
                Bas\u00e9 sur les tendances des 3 derniers mois
              </p>
            </div>
          )}

          <div className="trends-grid">
            {trends.map((trend, index) => {
              const previousTrend = index > 0 ? trends[index - 1] : null;
              const growth = previousTrend ? calculateGrowthRate(trend.new_leads, previousTrend.new_leads) : 0;

              return (
                <div key={trend.period} className="trend-card">
                  <div className="trend-header">
                    <h3>{formatMonth(trend.period)}</h3>
                    {previousTrend && (
                      <div className={`growth-indicator ${growth > 0 ? 'positive' : growth < 0 ? 'negative' : 'neutral'}`}>
                        <i className={`fas ${growth > 0 ? 'fa-arrow-up' : growth < 0 ? 'fa-arrow-down' : 'fa-minus'}`}></i>
                        <span>{Math.abs(growth).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>

                  <div className="trend-metrics">
                    <div className="metric">
                      <div className="metric-icon new">
                        <i className="fas fa-star"></i>
                      </div>
                      <div className="metric-info">
                        <span className="metric-value">{trend.new_leads}</span>
                        <span className="metric-label">Nouveaux</span>
                      </div>
                    </div>

                    <div className="metric">
                      <div className="metric-icon contacted">
                        <i className="fas fa-phone"></i>
                      </div>
                      <div className="metric-info">
                        <span className="metric-value">{trend.contacted}</span>
                        <span className="metric-label">Contact\u00e9s</span>
                      </div>
                    </div>

                    <div className="metric">
                      <div className="metric-icon qualified">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <div className="metric-info">
                        <span className="metric-value">{trend.qualified}</span>
                        <span className="metric-label">Qualifi\u00e9s</span>
                      </div>
                    </div>

                    <div className="metric">
                      <div className="metric-icon converted">
                        <i className="fas fa-trophy"></i>
                      </div>
                      <div className="metric-info">
                        <span className="metric-value">{trend.converted}</span>
                        <span className="metric-label">Convertis</span>
                      </div>
                    </div>
                  </div>

                  <div className="trend-footer">
                    <div className="conversion-rate">
                      <span className="rate-label">Taux de conversion:</span>
                      <span className="rate-value">
                        {trend.new_leads > 0 ? ((trend.converted / trend.new_leads) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="insights-section">
            <h2>Insights Cl\u00e9s</h2>
            <div className="insights-grid">
              <div className="insight-card">
                <i className="fas fa-chart-bar"></i>
                <h4>Meilleure p\u00e9riode</h4>
                <p>
                  {trends.length > 0 &&
                    formatMonth(trends.reduce((max, t) => t.new_leads > max.new_leads ? t : max).period)
                  }
                </p>
              </div>

              <div className="insight-card">
                <i className="fas fa-percentage"></i>
                <h4>Taux de conversion moyen</h4>
                <p>
                  {trends.length > 0 && (
                    (trends.reduce((acc, t) => acc + (t.new_leads > 0 ? (t.converted / t.new_leads) : 0), 0) / trends.length * 100).toFixed(1)
                  )}%
                </p>
              </div>

              <div className="insight-card">
                <i className="fas fa-trophy"></i>
                <h4>Total conversions</h4>
                <p>
                  {trends.reduce((acc, t) => acc + t.converted, 0)} leads
                </p>
              </div>

              <div className="insight-card">
                <i className="fas fa-users"></i>
                <h4>Total leads</h4>
                <p>
                  {trends.reduce((acc, t) => acc + t.new_leads, 0)} leads
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrendsReport;
