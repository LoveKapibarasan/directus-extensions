import ExportPanel from './ExportPanel.vue';

export default {
  id: 'export-transactions-panel',
  name: 'Transaction Export',
  icon: 'file_download',
  description: 'Export Transactions to Excel by date range',
  component: ExportPanel,
  options: null,
  minWidth: 20,
  minHeight: 8,
};
