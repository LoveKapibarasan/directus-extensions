import ExcelJS from 'exceljs';

export default (router, { services, getSchema }) => {
  const { ItemsService } = services;

  router.get('/', async (req, res) => {
    try {
      const schema = await getSchema();
      const today = new Date().toISOString().split('T')[0];
      const from = req.query.from || today;
      const to = req.query.to || from;

      if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
        return res.status(400).json({ error: 'from/to must be YYYY-MM-DD' });
      }
      if (from > to) {
        return res.status(400).json({ error: 'from must be before or equal to to' });
      }

      const service = new ItemsService('Transactions', {
        schema,
        accountability: req.accountability,
      });

      const transactions = await service.readByQuery({
        filter: {
          startTime: {
            _gte: `${from}T00:00:00.000Z`,
            _lte: `${to}T23:59:59.999Z`,
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
        sort: ['startTime'],
      });

      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'CitrineOS / AI-Charge';
      workbook.created = new Date();

      const sheet = workbook.addWorksheet('Transactions', {
        views: [{ state: 'frozen', ySplit: 1 }],
      });

      sheet.columns = [
        { header: 'ID',             key: 'id',            width: 8  },
        { header: 'Station ID',     key: 'stationId',     width: 18 },
        { header: 'Transaction ID', key: 'transactionId', width: 38 },
        { header: 'State',          key: 'chargingState', width: 14 },
        { header: 'kWh',            key: 'totalKwh',      width: 10 },
        { header: 'Cost',           key: 'totalCost',     width: 10 },
        { header: 'Start (UTC)',    key: 'startTime',     width: 22 },
        { header: 'End (UTC)',      key: 'endTime',       width: 22 },
        { header: 'Stop Reason',    key: 'stoppedReason', width: 18 },
        { header: 'Active',         key: 'isActive',      width: 8  },
      ];

      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C5F8A' } };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

      transactions.forEach((t) => {
        const row = sheet.addRow(t);
        row.getCell('totalKwh').numFmt = '0.000';
        row.getCell('totalCost').numFmt = '0.00';
      });

      sheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: sheet.columns.length },
      };

      const filename = from === to
        ? `transactions-${from}.xlsx`
        : `transactions-${from}-to-${to}.xlsx`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      await workbook.xlsx.write(res);
      res.end();
    } catch (err) {
      console.error('[export-transactions]', err);
      res.status(500).json({ error: err.message });
    }
  });
};
