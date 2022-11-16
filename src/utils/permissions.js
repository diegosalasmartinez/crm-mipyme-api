const validateRoles = (roles, rolesPermitted) => {
  if (rolesPermitted.length === 0) {
    return true;
  }
  return roles.filter((r) => rolesPermitted.includes(r.key)).length > 0;
};

module.exports = {
  validateRoles,
};
