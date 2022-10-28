const moment = require('moment');

const roles = {
  ADMIN: 'admin',
  ADMIN_MARKETING: 'marketing_admin',
  MARKETING: 'marketing',
  ADMIN_SALES: 'sales_admin',
  SALES: 'sales',
  ADMIN_SERVICES: 'services_admin',
  SERVICES: 'services',
};

const hasRole = (userRoles, roles) => {
  return userRoles.filter((r) => roles.includes(r.key)).length > 0;
};

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
  roles,
  hasRole,
  months,
  generateChartLabels
};
