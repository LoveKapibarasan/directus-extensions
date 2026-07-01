import ExportPage from './ExportPage.vue';

export default {
  id: 'export-transactions',
  name: 'Transaction Export',
  icon: 'file_download',
  routes: [
    {
      path: '',
      component: ExportPage,
    },
  ],
};
