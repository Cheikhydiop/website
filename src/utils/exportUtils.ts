export const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      alert('Aucune donnée à exporter');
      return;
    }
  
    const headers = Object.keys(data[0]);
  
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
  
          if (typeof value === 'object') {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
  
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
  
          return stringValue;
        }).join(',')
      )
    ].join('\n');
  
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    URL.revokeObjectURL(url);
  };
  
  export const formatLeadsForExport = (leads: any[]) => {
    return leads.map(lead => ({
      'Date création': new Date(lead.created_at).toLocaleDateString('fr-FR'),
      'Entreprise': lead.company_name,
      'Contact': lead.contact_name,
      'Email': lead.email,
      'Téléphone': lead.phone,
      'Type de site': lead.site_type,
      'Facture électricité (FCFA)': lead.electricity_bill,
      'Puissance installation (kW)': lead.installation_power || '',
      'Points de mesure': lead.measurement_points || '',
      'Budget (FCFA)': lead.budget || '',
      'Statut': lead.status,
      'Scénarios recommandés': lead.recommended_scenarios ? JSON.stringify(lead.recommended_scenarios) : '',
    }));
  };
  
  export const formatAnalyticsForExport = (analytics: any) => {
    const exportData = [];

    if (analytics.conversionRate) {
      exportData.push({
        'Métrique': 'Taux de conversion',
        'Valeur': `${analytics.conversionRate.conversion_rate}%`,
        'Détails': `${analytics.conversionRate.converted_leads} convertis sur ${analytics.conversionRate.total_leads} leads`
      });
    }

    if (analytics.leadSources) {
      analytics.leadSources.forEach((source: any) => {
        exportData.push({
          'Métrique': `Source - ${source.source}`,
          'Valeur': source.count,
          'Détails': 'Nombre de leads'
        });
      });
    }

    if (analytics.visitStats) {
      exportData.push({
        'Métrique': 'Visites totales',
        'Valeur': analytics.visitStats.total_visits,
        'Détails': `${analytics.visitStats.unique_visitors} visiteurs uniques`
      });
    }

    return exportData;
  };

  export const formatLeadsWithAnalyticsForExport = (leads: any[], includeInteractions = true) => {
    return leads.map(lead => {
      const baseData = {
        'Date création': new Date(lead.created_at).toLocaleDateString('fr-FR'),
        'Entreprise': lead.company_name,
        'Contact': lead.contact_name,
        'Email': lead.email,
        'Téléphone': lead.phone,
        'Type de site': lead.site_type,
        'Facture électricité (FCFA)': lead.electricity_bill,
        'Puissance installation (kW)': lead.installation_power || '',
        'Points de mesure': lead.measurement_points || '',
        'Budget (FCFA)': lead.budget || '',
        'Statut': lead.status,
        'Besoins': lead.specific_needs ? lead.specific_needs.join(', ') : '',
        'Zones surveillance': lead.zones_to_monitor ? lead.zones_to_monitor.join(', ') : '',
      };

      if (includeInteractions && lead.interactions) {
        return {
          ...baseData,
          'Nombre interactions': lead.interactions.length,
          'Dernière interaction': lead.interactions.length > 0
            ? new Date(lead.interactions[0].created_at).toLocaleDateString('fr-FR')
            : '',
          'Type dernière interaction': lead.interactions.length > 0
            ? lead.interactions[0].interaction_type
            : ''
        };
      }

      return baseData;
    });
  };

  export const formatSegmentForExport = (segment: any, leads: any[]) => {
    return {
      'Nom du segment': segment.name,
      'Description': segment.description,
      'Nombre de leads': leads.length,
      'Taux de conversion': leads.length > 0
        ? `${(leads.filter((l: any) => l.status === 'converted').length / leads.length * 100).toFixed(1)}%`
        : '0%',
      'Budget total': leads.reduce((sum: number, l: any) => sum + (l.budget || 0), 0).toLocaleString() + ' FCFA',
      'Facture électricité totale': leads.reduce((sum: number, l: any) => sum + (l.electricity_bill || 0), 0).toLocaleString() + ' FCFA'
    };
  };
  