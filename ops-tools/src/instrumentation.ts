export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { ensurePaymentTablesTracked } = await import('@lib/server/ensure-hasura-tracked');
    await ensurePaymentTablesTracked();
  }
}
