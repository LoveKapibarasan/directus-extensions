export default (router, { services, getSchema }) => {
  const { ItemsService } = services;

  router.get('/', async (req, res) => {
    try {
      const schema = await getSchema();
      const date = req.query.date || new Date().toISOString().split('T')[0];

      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ error: 'date must be YYYY-MM-DD' });
      }

      const accountability = req.accountability;

      const [stations, transactions] = await Promise.all([
        new ItemsService('ChargingStations', { schema, accountability }).readByQuery({
          fields: ['id', 'isOnline', 'locationId', 'protocol', 'chargePointVendor', 'chargePointModel', 'latestOcppMessageTimestamp'],
          limit: -1,
        }),
        new ItemsService('Transactions', { schema, accountability }).readByQuery({
          filter: {
            startTime: {
              _gte: `${date}T00:00:00.000Z`,
              _lte: `${date}T23:59:59.999Z`,
            },
          },
          fields: [
            'id', 'stationId', 'transactionId', 'chargingState',
            'totalKwh', 'totalCost', 'startTime', 'endTime',
            'stoppedReason', 'isActive',
          ],
          sort: ['startTime'],
          limit: -1,
        }),
      ]);

      const onlineCount = stations.filter((s) => s.isOnline).length;
      const totalKwh = transactions.reduce((sum, t) => sum + (parseFloat(t.totalKwh) || 0), 0);
      const totalCost = transactions.reduce((sum, t) => sum + (parseFloat(t.totalCost) || 0), 0);

      res.json({
        date,
        summary: {
          totalStations: stations.length,
          onlineStations: onlineCount,
          offlineStations: stations.length - onlineCount,
          totalTransactions: transactions.length,
          totalKwh: Math.round(totalKwh * 1000) / 1000,
          totalCost: Math.round(totalCost * 100) / 100,
        },
        stations,
        transactions,
      });
    } catch (err) {
      console.error('[report-data]', err);
      res.status(500).json({ error: err.message });
    }
  });
};
