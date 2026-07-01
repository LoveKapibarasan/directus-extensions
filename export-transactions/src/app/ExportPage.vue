<template>
  <private-view title="Transaction Export" headline="Reports">
    <div class="export-page">
      <v-card class="card">
        <v-card-title>Export Transactions to Excel</v-card-title>
        <v-card-text>
          <div class="field-grid">
            <div class="field">
              <div class="type-label">From Date</div>
              <v-input v-model="fromDate" type="date" :max="toDate" />
            </div>
            <div class="field">
              <div class="type-label">To Date</div>
              <v-input v-model="toDate" type="date" :min="fromDate" />
            </div>
          </div>

          <div class="actions">
            <v-button :loading="loading" :disabled="!fromDate || !toDate" large @click="exportExcel">
              <v-icon name="download" left />
              Download Excel
            </v-button>
            <span v-if="!loading && lastCount !== null" class="count-label">
              {{ lastCount }} records
            </span>
          </div>

          <v-notice v-if="errorMsg" type="danger" class="notice">
            {{ errorMsg }}
          </v-notice>
          <v-notice v-if="successMsg" type="success" class="notice">
            {{ successMsg }}
          </v-notice>
        </v-card-text>
      </v-card>
    </div>
  </private-view>
</template>

<script setup>
import { ref } from 'vue';
import { useApi } from '@directus/extensions-sdk';

const api = useApi();

const today = new Date().toISOString().split('T')[0];
const fromDate = ref(today);
const toDate = ref(today);
const loading = ref(false);
const errorMsg = ref(null);
const successMsg = ref(null);
const lastCount = ref(null);

async function exportExcel() {
  loading.value = true;
  errorMsg.value = null;
  successMsg.value = null;
  lastCount.value = null;

  try {
    const response = await api.get('/export-transactions', {
      params: { from: fromDate.value, to: toDate.value },
      responseType: 'blob',
    });

    // Extract filename from Content-Disposition header if available
    const disposition = response.headers['content-disposition'] || '';
    const match = disposition.match(/filename="([^"]+)"/);
    const filename = match?.[1] ?? `transactions-${fromDate.value}-to-${toDate.value}.xlsx`;

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    successMsg.value = `Downloaded: ${filename}`;
  } catch (err) {
    if (err.response?.data instanceof Blob) {
      const text = await err.response.data.text();
      try {
        errorMsg.value = JSON.parse(text)?.error ?? text;
      } catch {
        errorMsg.value = text;
      }
    } else {
      errorMsg.value = err?.response?.data?.error ?? err.message ?? 'Export failed';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.export-page {
  padding: var(--content-padding);
  max-width: 680px;
}

.card {
  padding: 8px;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 28px;
}

.field .type-label {
  margin-bottom: 8px;
  color: var(--foreground-subdued);
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.count-label {
  font-size: 14px;
  color: var(--foreground-subdued);
}

.notice {
  margin-top: 16px;
}
</style>
