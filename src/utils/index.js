export const roles = {
  ADMIN: 'admin',
  ADMIN_MARKETING: 'marketing_admin',
  MARKETING: 'marketing',
  ADMIN_SALES: 'sales_admin',
  SALES: 'sales',
  ADMIN_SERVICES: 'services_admin',
  SERVICES: 'services',
};

export const hasRole = (userRoles, roles) => {
  return userRoles.filter((r) => roles.includes(r.key)).length > 0;
};
