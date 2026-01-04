function checkRole(user, list, role) {
  if (role === "owner") return list.vlastnik === user;
  if (role === "member") return list.clenove.includes(user);
  return false;
}

module.exports = { checkRole };
