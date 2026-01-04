function validateDtoIn(dtoIn, requiredFields) {
  const uuAppErrorMap = {};
  requiredFields.forEach(field => {
    if (!dtoIn[field]) {
      uuAppErrorMap[field] = `${field} is required`;
    }
  });
  return uuAppErrorMap;
}

module.exports = { validateDtoIn };
