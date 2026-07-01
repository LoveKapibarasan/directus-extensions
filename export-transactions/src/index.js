import ExcelJS from 'exceljs';

export default (router, { services, getSchema }) => {
  const { ItemsService } = services;

  router.get('/', async (req, res) => {
    try {
      const schema = await getSchema();
      const date = req.query.date || new Date().toISOString().split('T')[0];

      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ error: 'date must be YYYY-MM-DD format' });
      }

      const service = new ItemsService('Transactions', {
        schema,
        accountability: req.accountability,
      });

      const transactions = await service.readByQuery({
        filter: {
          startTime: {
            _gte: `${date}T00:00:00.000Z`,
            _lte: `${date}T23:59:59.999Z`,
          },
        },
        limit: -1,
        fields: [
          'id',
          'stationId',
          'transactionId',
          'chargingState',
          'totalKwh',
          'totalCost',
          'startTime',
          'endTime',
          'stoppedReason',
          'isActive',
        ],
      });

      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'CitrineOS';
      workbook.created = new Date();

      const sheet = workbook.addWorksheet('Transactions');

      sheet.columns = [
        { header: 'ID',              key: 'id',            width: 8  },
        { header: 'Station ID',      key: 'stationId',     width: 18 },
        { header: 'Transaction ID',  key: 'transactionId', width: 38 },
        { header: 'State',           key: 'chargingState', width: 14 },
        { header: 'kWh',             key: 'totalKwh',      width: 10 },
        { header: 'Cost',            key: 'totalCost',     width: 10 },
        { header: 'Start (UTC)',     key: 'startTime',     width: 22 },
        { header: 'End (UTC)',       key: 'endTime',       width: 22 },
        { header: 'Stopped Reason',  key: 'stoppedReason', width: 20 },
        { header: 'Active',          key: 'isActive',      width: 8  },
      ];

      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2C5F8A' },
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

      transactions.forEach((t) => sheet.addRow(t));

      sheet.autoFilter = {
        from: { row: 1, column: 1 },
        to:   { row: 1, column: sheet.columns.length },
      };

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="transactions-${date}.xlsx"`,
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (err) {
      console.error('[export-transactions]', err);
      res.status(500).json({ error: err.message });
    }
  });
};
