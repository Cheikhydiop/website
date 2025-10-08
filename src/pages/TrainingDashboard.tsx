import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Metrics = {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  mae: number;
  sitePatterns: Record<string, any>;
  scenarioPatterns: Record<string, any>;
};

type TrainingHistoryItem = {
  version: string;
  accuracy: number;
  samples: number;
  date: string;
};

const TrainingDashboard = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [trainingHistory, setTrainingHistory] = useState<TrainingHistoryItem[]>([]);
  const [newData, setNewData] = useState({
    siteType: '',
    electricityBill: '',
    installationPower: '',
    budget: '',
    chosenScenario: '',
    actualSavings: '',
    satisfaction: '',
    roiMonths: ''
  });

  // Simuler le chargement des données
  useEffect(() => {
    loadTrainingHistory();
  }, []);

  const loadTrainingHistory = () => {
    // Données de démonstration
    setTrainingHistory([
      { version: 'v1.0', accuracy: 85, samples: 8, date: '2025-01-15' },
      { version: 'v1.1', accuracy: 87, samples: 15, date: '2025-02-10' },
      { version: 'v1.2', accuracy: 89, samples: 23, date: '2025-03-05' }
    ]);
  };

  const handleTrainModel = async () => {
    setLoading(true);
    
    // Simulation de l'entraînement
    setTimeout(() => {
      setMetrics({
        accuracy: 0.89,
        precision: 0.87,
        recall: 0.91,
        f1: 0.89,
        mae: 2.1,
        sitePatterns: {
          'bureau': { count: 5, avgSavings: 24, mostChosen: 'standard' },
          'usine': { count: 3, avgSavings: 36, mostChosen: 'premium' },
          'commerce': { count: 4, avgSavings: 18, mostChosen: 'economique' }
        },
        scenarioPatterns: {
          'economique': { count: 4, avgSavings: 17, avgROI: 19 },
          'standard': { count: 8, avgSavings: 26, avgROI: 13 },
          'premium': { count: 3, avgSavings: 38, avgROI: 10 }
        }
      });
      setLoading(false);
    }, 2000);
  };

  const handleAddTrainingData = () => {
    alert('Données ajoutées à l\'ensemble d\'entraînement !');
    setNewData({
      siteType: '',
      electricityBill: '',
      installationPower: '',
      budget: '',
      chosenScenario: '',
      actualSavings: '',
      satisfaction: '',
      roiMonths: ''
    });
  };

  const sitePatternData = metrics?.sitePatterns 
    ? Object.entries(metrics.sitePatterns).map(([name, data]: [string, any]) => ({
        name,
        count: data.count,
        avgSavings: data.avgSavings
      }))
    : [];

  const scenarioPatternData = metrics?.scenarioPatterns
    ? Object.entries(metrics.scenarioPatterns).map(([name, data]: [string, any]) => ({
        name,
        count: data.count,
        avgSavings: data.avgSavings,
        avgROI: data.avgROI
      }))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Entraînement du Modèle IA 🤖
          </h1>
          <p className="text-slate-600">
            Gestion et amélioration continue du système de recommandation
          </p>
        </div>

        {/* Actions principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              🎯 Entraîner le modèle
            </h2>
            <p className="text-slate-600 mb-6">
              Analysez les données collectées et générez un nouveau modèle optimisé
            </p>
            <button
              onClick={handleTrainModel}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-lg font-semibold hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? '⏳ Entraînement en cours...' : '🚀 Lancer l\'entraînement'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              📊 Historique d'entraînement
            </h2>
            <div className="space-y-3">
              {trainingHistory.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div>
                    <span className="font-semibold text-slate-800">{item.version}</span>
                    <span className="text-sm text-slate-500 ml-2">({item.date})</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600">{item.samples} échantillons</span>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {item.accuracy}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Métriques du modèle */}
        {metrics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg p-6 text-white">
                <div className="text-sm opacity-90 mb-2">Exactitude</div>
                <div className="text-4xl font-bold">{(metrics.accuracy * 100).toFixed(0)}%</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg p-6 text-white">
                <div className="text-sm opacity-90 mb-2">Précision</div>
                <div className="text-4xl font-bold">{(metrics.precision * 100).toFixed(0)}%</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
                <div className="text-sm opacity-90 mb-2">Rappel</div>
                <div className="text-4xl font-bold">{(metrics.recall * 100).toFixed(0)}%</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white">
                <div className="text-sm opacity-90 mb-2">Score F1</div>
                <div className="text-4xl font-bold">{(metrics.f1 * 100).toFixed(0)}%</div>
              </div>
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  Patterns par type de site
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sitePatternData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#00b894" name="Nombre de cas" />
                    <Bar dataKey="avgSavings" fill="#0984e3" name="Économies moyennes (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  Performance par scénario
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scenarioPatternData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgSavings" fill="#6c5ce7" name="Économies moyennes (%)" />
                    <Bar dataKey="avgROI" fill="#fdcb6e" name="ROI moyen (mois)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* Formulaire d'ajout de données */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            ➕ Ajouter des données d'entraînement
          </h2>
          <p className="text-slate-600 mb-6">
            Après chaque projet terminé, ajoutez les résultats réels pour améliorer le modèle
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Type de site
              </label>
              <select
                value={newData.siteType}
                onChange={(e) => setNewData({...newData, siteType: e.target.value})}
                className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Sélectionner</option>
                <option value="bureau">Bureau</option>
                <option value="usine">Usine</option>
                <option value="commerce">Commerce</option>
                <option value="immeuble">Immeuble</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Facture mensuelle (FCFA)
              </label>
              <input
                type="number"
                value={newData.electricityBill}
                onChange={(e) => setNewData({...newData, electricityBill: e.target.value})}
                className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                placeholder="150000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Puissance (kW)
              </label>
              <input
                type="number"
                value={newData.installationPower}
                onChange={(e) => setNewData({...newData, installationPower: e.target.value})}
                className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                placeholder="15"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Budget (FCFA)
              </label>
              <input
                type="number"
                value={newData.budget}
                onChange={(e) => setNewData({...newData, budget: e.target.value})}
                className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                placeholder="2500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Scénario choisi
              </label>
              <select
                value={newData.chosenScenario}
                onChange={(e) => setNewData({...newData, chosenScenario: e.target.value})}
                className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Sélectionner</option>
                <option value="economique">Économique</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Économies réelles (%)
              </label>
              <input
                type="number"
                value={newData.actualSavings}
                onChange={(e) => setNewData({...newData, actualSavings: e.target.value})}
                className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                placeholder="25"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Satisfaction (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={newData.satisfaction}
                onChange={(e) => setNewData({...newData, satisfaction: e.target.value})}
                className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                ROI (mois)
              </label>
              <input
                type="number"
                value={newData.roiMonths}
                onChange={(e) => setNewData({...newData, roiMonths: e.target.value})}
                className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                placeholder="18"
              />
            </div>
          </div>

          <button
            onClick={handleAddTrainingData}
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 rounded-lg font-semibold hover:shadow-xl transition-all"
          >
            Ajouter aux données d'entraînement
          </button>
        </div>

        {/* Guide d'utilisation */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Guide d'entraînement du modèle
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="bg-white rounded-lg p-4 mb-3">
                <div className="text-3xl mb-2">1️⃣</div>
                <h3 className="font-bold text-slate-800 mb-2">Collecter les données</h3>
                <p className="text-sm text-slate-600">
                  Après chaque installation terminée, ajoutez les résultats réels dans le système
                </p>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg p-4 mb-3">
                <div className="text-3xl mb-2">2️⃣</div>
                <h3 className="font-bold text-slate-800 mb-2">Entraîner le modèle</h3>
                <p className="text-sm text-slate-600">
                  Minimum 10-15 cas pour un premier entraînement, puis régulièrement tous les mois
                </p>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg p-4 mb-3">
                <div className="text-3xl mb-2">3️⃣</div>
                <h3 className="font-bold text-slate-800 mb-2">Activer le modèle</h3>
                <p className="text-sm text-slate-600">
                  Si les métriques sont satisfaisantes (85% d'exactitude), activez le nouveau modèle
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingDashboard;