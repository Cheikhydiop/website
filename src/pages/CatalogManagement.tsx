import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import './CatalogManagement.css';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  technical_specs: any;
  performance_data: any;
  created_at: string;
  updated_at: string;
}

interface Scenario {
  id: string;
  name: string;
  category: string;
  site_types: string[];
  min_budget: number;
  max_budget: number;
  products: any;
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

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    if (activeTab === 'products') {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setProducts(data);
    } else {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setScenarios(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, type: 'products' | 'scenarios') => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    const { error } = await supabase
      .from(type)
      .delete()
      .eq('id', id);

    if (!error) {
      loadData();
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
  };

  return (
    <>
      <Header />
      <div className="catalog-management">
        <div className="container">
          <div className="catalog-header">
            <h1>Gestion du Catalogue</h1>
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
              Produits
            </button>
            <button
              className={`tab ${activeTab === 'scenarios' ? 'active' : ''}`}
              onClick={() => setActiveTab('scenarios')}
            >
              <i className="fas fa-layer-group"></i>
              Scénarios
            </button>
          </div>

          {loading ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              Chargement...
            </div>
          ) : (
            <div className="catalog-content">
              {activeTab === 'products' ? (
                <div className="products-grid">
                  {products.map((product) => (
                    <div key={product.id} className="catalog-card">
                      <div className="card-header">
                        <span className={`category-badge ${product.category}`}>
                          {product.category}
                        </span>
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
                        <span className="price">{product.price} CFA</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="scenarios-grid">
                  {scenarios.map((scenario) => (
                    <div key={scenario.id} className="catalog-card">
                      <div className="card-header">
                        <span className={`category-badge ${scenario.category}`}>
                          {scenario.category}
                        </span>
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
                  ))}
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
  const [formData, setFormData] = useState(item || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item ? 'Modifier' : 'Créer'} {type === 'products' ? 'Produit' : 'Scénario'}</h2>
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
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
            />
          </div>
          {type === 'products' && (
            <div className="form-group">
              <label>Prix (frans)</label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
              />
            </div>
          )}
          {type === 'scenarios' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Budget Min (francs)</label>
                  <input
                    type="number"
                    value={formData.min_budget || ''}
                    onChange={(e) => setFormData({ ...formData, min_budget: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Budget Max (€)</label>
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
