<template>
  <div class="export-panel">
    <div class="fields">
      <div class="field">
        <span class="label">From</span>
        <v-input v-model="fromDate" type="date" :max="toDate" small />
      </div>
      <div class="field">
        <span class="label">To</span>
        <v-input v-model="toDate" type="date" :min="fromDate" small />
      </div>
    </div>
    <v-button :loading="loading" small @click="exportExcel">
      <v-icon name="download" left small />
      Export Excel
    </v-button>
    <v-notice v-if="msg" :type="msgType" class="msg">{{ msg }}</v-notice>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useApi } from '@directus/extensions-sdk';

const api = useApi();
const today = new Date().toISOString().split('T')[0];
const fromDate = ref(today);
const toDate = ref(today);
const loading = ref(false);
const msg = ref(null);
const msgType = ref('info');

async function exportExcel() {
  loading.value = true;
  msg.value = null;
  try {
    const res = await api.get('/export-transactions', {
      params: { from: fromDate.value, to: toDate.value },
      responseType: 'blob',
    });
    const disp = res.headers['content-disposition'] || '';
    const match = disp.match(/filename="([^"]+)"/);
    const filename = match?.[1] ?? `transactions-${fromDate.value}-to-${toDate.value}.xlsx`;
    const url = URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    msg.value = `Downloaded: ${filename}`;
    msgType.value = 'success';
  } catch (e) {
    msg.value = e?.message ?? 'Export failed';
    msgType.value = 'danger';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.export-panel {
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.fields {
  display: flex;
  gap: 12px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}
.label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--foreground-subdued);
}
.msg {
  margin-top: 4px;
}
</style>
