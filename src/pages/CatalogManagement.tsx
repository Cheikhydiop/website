import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import './CatalogManagement.css';

interface Product {
  id: string;
  name: string;
  type: 'compteur' | 'smart_switch' | 'equipement_connecte';
  gamme: 'economique' | 'standard' | 'premium';
  niveau_technique: 'residentiel' | 'tertiaire' | 'industriel';
  description: string;
  prix: number;
  specifications_techniques: any;
  donnees_performance: any;
  image_url: string;
  est_actif: boolean;
  created_at: string;
  updated_at: string;
}

interface Scenario {
  id: string;
  name: string;
  category: string;
  gamme: 'economique' | 'standard' | 'premium';
  niveau_technique: 'residentiel' | 'tertiaire' | 'industriel';
  site_types: string[];
  min_budget: number;
  max_budget: number;
  products: any;
  equipements: any;
  estimated_savings: number;
  equipment_lifespan: number;
  description: string;
  created_at: string;
  updated_at: string;
}

const CatalogManagement = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'scenarios'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Filtres pour les produits
  const [filters, setFilters] = useState({
    type: '',
    gamme: '',
    niveau_technique: ''
  });

  useEffect(() => {
    loadData();
  }, [activeTab, filters]);

  const loadData = async () => {
    setLoading(true);
    
    try {
      if (activeTab === 'products') {
        let query = supabase
          .from('products')
          .select('*')
          .eq('est_actif', true);

        // Appliquer les filtres
        if (filters.type) {
          query = query.eq('type', filters.type);
        }
        if (filters.gamme) {
          query = query.eq('gamme', filters.gamme);
        }
        if (filters.niveau_technique) {
          query = query.eq('niveau_technique', filters.niveau_technique);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) {
          console.error('Erreur lors du chargement des produits:', error);
        } else {
          setProducts(data || []);
        }
      } else {
        const { data, error } = await supabase
          .from('scenarios')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Erreur lors du chargement des scénarios:', error);
        } else {
          setScenarios(data || []);
        }
      }
    } catch (error) {
      console.error('Exception lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: 'products' | 'scenarios') => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      if (type === 'products') {
        // Soft delete pour les produits
        const { error } = await supabase
          .from('products')
          .update({ est_actif: false })
          .eq('id', id);
        
        if (!error) {
          loadData();
        }
      } else {
        const { error } = await supabase
          .from('scenarios')
          .delete()
          .eq('id', id);

        if (!error) {
          loadData();
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleSave = async (formData: any) => {
    const table = activeTab;

    try {
      if (editingItem) {
        const { error } = await supabase
          .from(table)
          .update(formData)
          .eq('id', editingItem.id);

        if (!error) {
          setShowModal(false);
          loadData();
        }
      } else {
        const { error } = await supabase
          .from(table)
          .insert([formData]);

        if (!error) {
          setShowModal(false);
          loadData();
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      gamme: '',
      niveau_technique: ''
    });
  };

  // Fonctions de traduction pour l'affichage
  const translateType = (type: string) => {
    const types: { [key: string]: string } = {
      'compteur': 'Compteur',
      'smart_switch': 'Smart Switch',
      'equipement_connecte': 'Équipement Connecté'
    };
    return types[type] || type;
  };

  const translateGamme = (gamme: string) => {
    const gammes: { [key: string]: string } = {
      'economique': 'Économique',
      'standard': 'Standard',
      'premium': 'Premium'
    };
    return gammes[gamme] || gamme;
  };

  const translateNiveauTechnique = (niveau: string) => {
    const niveaux: { [key: string]: string } = {
      'residentiel': 'Résidentiel',
      'tertiaire': 'Tertiaire',
      'industriel': 'Industriel'
    };
    return niveaux[niveau] || niveau;
  };

  return (
    <>
      <Header />
      <div className="catalog-management">
        <div className="container">
          <div className="catalog-header">
            <h1>Gestion du Catalogue d'Équipements</h1>
            <button className="create-btn" onClick={openCreateModal}>
              <i className="fas fa-plus"></i>
              Créer nouveau
            </button>
          </div>

          <div className="tabs">
            <button
              className={`tab ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <i className="fas fa-box"></i>
              Équipements
            </button>
            <button
              className={`tab ${activeTab === 'scenarios' ? 'active' : ''}`}
              onClick={() => setActiveTab('scenarios')}
            >
              <i className="fas fa-layer-group"></i>
              Scénarios
            </button>
          </div>

          {/* Filtres pour les produits */}
          {activeTab === 'products' && (
            <div className="filters-section">
              <h3>Filtrer les équipements</h3>
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Type d'équipement</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  >
                    <option value="">Tous les types</option>
                    <option value="compteur">Compteurs</option>
                    <option value="smart_switch">Smart Switches</option>
                    <option value="equipement_connecte">Équipements Connectés</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Gamme</label>
                  <select
                    value={filters.gamme}
                    onChange={(e) => setFilters({ ...filters, gamme: e.target.value })}
                  >
                    <option value="">Toutes les gammes</option>
                    <option value="economique">Économique</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Niveau technique</label>
                  <select
                    value={filters.niveau_technique}
                    onChange={(e) => setFilters({ ...filters, niveau_technique: e.target.value })}
                  >
                    <option value="">Tous les niveaux</option>
                    <option value="residentiel">Résidentiel</option>
                    <option value="tertiaire">Tertiaire</option>
                    <option value="industriel">Industriel</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>&nbsp;</label>
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    <i className="fas fa-times"></i>
                    Effacer les filtres
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              Chargement...
            </div>
          ) : (
            <div className="catalog-content">
              {activeTab === 'products' ? (
                <div className="scrollable-section">
                  <div className="results-count">
                    {products.length} équipement(s) trouvé(s)
                  </div>
                  <div className="products-scroll-container">
                    <div className="products-grid">
                      {products.length === 0 ? (
                        <div className="no-results">
                          <i className="fas fa-search"></i>
                          <p>Aucun équipement trouvé avec les filtres sélectionnés</p>
                          <button onClick={loadData} className="retry-btn">
                            <i className="fas fa-sync"></i>
                            Réessayer
                          </button>
                        </div>
                      ) : (
                        products.map((product) => (
                          <div key={product.id} className="catalog-card">
                            {product.image_url && (
                              <div className="card-image">
                                <img src={product.image_url} alt={product.name} />
                              </div>
                            )}
                            <div className="card-header">
                              <div className="card-badges">
                                <span className={`type-badge ${product.type}`}>
                                  {translateType(product.type)}
                                </span>
                                <span className={`gamme-badge ${product.gamme}`}>
                                  {translateGamme(product.gamme)}
                                </span>
                                <span className={`niveau-badge ${product.niveau_technique}`}>
                                  {translateNiveauTechnique(product.niveau_technique)}
                                </span>
                              </div>
                              <div className="card-actions">
                                <button onClick={() => openEditModal(product)}>
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button onClick={() => handleDelete(product.id, 'products')}>
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <div className="card-footer">
                              <span className="price">{product.prix.toLocaleString()} FCFA</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="scrollable-section">
                  <div className="results-count">
                    {scenarios.length} scénario(s) trouvé(s)
                  </div>
                  <div className="scenarios-scroll-container">
                    <div className="scenarios-grid">
                      {scenarios.length === 0 ? (
                        <div className="no-results">
                          <i className="fas fa-search"></i>
                          <p>Aucun scénario trouvé</p>
                          <button onClick={loadData} className="retry-btn">
                            <i className="fas fa-sync"></i>
                            Réessayer
                          </button>
                        </div>
                      ) : (
                        scenarios.map((scenario) => (
                          <div key={scenario.id} className="catalog-card">
                            <div className="card-header">
                              <div className="card-badges">
                                <span className={`category-badge ${scenario.category}`}>
                                  {scenario.category}
                                </span>
                                {scenario.gamme && (
                                  <span className={`gamme-badge ${scenario.gamme}`}>
                                    {translateGamme(scenario.gamme)}
                                  </span>
                                )}
                                {scenario.niveau_technique && (
                                  <span className={`niveau-badge ${scenario.niveau_technique}`}>
                                    {translateNiveauTechnique(scenario.niveau_technique)}
                                  </span>
                                )}
                              </div>
                              <div className="card-actions">
                                <button onClick={() => openEditModal(scenario)}>
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button onClick={() => handleDelete(scenario.id, 'scenarios')}>
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                            <h3>{scenario.name}</h3>
                            <p>{scenario.description}</p>
                            <div className="scenario-details">
                              <div className="detail-item">
                                <i className="fas fa-piggy-bank"></i>
                                <span>{scenario.estimated_savings}% d'économies</span>
                              </div>
                              <div className="detail-item">
                                <i className="fas fa-clock"></i>
                                <span>{scenario.equipment_lifespan} ans</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <EditModal
          item={editingItem}
          type={activeTab}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

interface EditModalProps {
  item: any;
  type: 'products' | 'scenarios';
  onSave: (data: any) => void;
  onClose: () => void;
}

const EditModal = ({ item, type, onSave, onClose }: EditModalProps) => {
  const [formData, setFormData] = useState(item || {
    est_actif: true,
    specifications_techniques: {},
    donnees_performance: {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item ? 'Modifier' : 'Créer'} {type === 'products' ? 'Équipement' : 'Scénario'}</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {type === 'products' ? (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Type d'équipement</label>
                  <select
                    value={formData.type || 'compteur'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="compteur">Compteur</option>
                    <option value="smart_switch">Smart Switch</option>
                    <option value="equipement_connecte">Équipement Connecté</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Gamme</label>
                  <select
                    value={formData.gamme || 'economique'}
                    onChange={(e) => setFormData({ ...formData, gamme: e.target.value })}
                    required
                  >
                    <option value="economique">Économique</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Niveau technique</label>
                  <select
                    value={formData.niveau_technique || 'residentiel'}
                    onChange={(e) => setFormData({ ...formData, niveau_technique: e.target.value })}
                    required
                  >
                    <option value="residentiel">Résidentiel</option>
                    <option value="tertiaire">Tertiaire</option>
                    <option value="industriel">Industriel</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Prix (FCFA)</label>
                  <input
                    type="number"
                    value={formData.prix || ''}
                    onChange={(e) => setFormData({ ...formData, prix: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>URL de l'image</label>
                <input
                  type="url"
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Catégorie</label>
                <select
                  value={formData.category || 'economique'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="economique">Économique</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Gamme</label>
                  <select
                    value={formData.gamme || 'economique'}
                    onChange={(e) => setFormData({ ...formData, gamme: e.target.value })}
                  >
                    <option value="economique">Économique</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Niveau technique</label>
                  <select
                    value={formData.niveau_technique || 'residentiel'}
                    onChange={(e) => setFormData({ ...formData, niveau_technique: e.target.value })}
                  >
                    <option value="residentiel">Résidentiel</option>
                    <option value="tertiaire">Tertiaire</option>
                    <option value="industriel">Industriel</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Budget Min (FCFA)</label>
                  <input
                    type="number"
                    value={formData.min_budget || ''}
                    onChange={(e) => setFormData({ ...formData, min_budget: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Budget Max (FCFA)</label>
                  <input
                    type="number"
                    value={formData.max_budget || ''}
                    onChange={(e) => setFormData({ ...formData, max_budget: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Économies (%)</label>
                  <input
                    type="number"
                    value={formData.estimated_savings || ''}
                    onChange={(e) => setFormData({ ...formData, estimated_savings: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Durée de vie (ans)</label>
                  <input
                    type="number"
                    value={formData.equipment_lifespan || ''}
                    onChange={(e) => setFormData({ ...formData, equipment_lifespan: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="save-btn">
              <i className="fas fa-save"></i>
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CatalogManagement;