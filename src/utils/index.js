const moment = require('moment');

const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dic'];

const generateChartLabels = (numMonths = 9) => {
  const chartLabels = {};
  const d = new Date();
  d.setDate(1);
  for (let m_month = 0; m_month < numMonths; m_month++) {
    chartLabels[moment(d).format('YYYY-MM')] = {
      value: 0,
      name: months[d.getMonth()],
    };
    d.setMonth(d.getMonth() - 1);
  }
  return chartLabels;
};

module.exports = {
  months,
  generateChartLabels
};
