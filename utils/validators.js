export function isEmpty(data) {
  return data === null || data === undefined || data === 0 || data.length === 0;
}
export function validateFormBody(data) {
  let errors;
  for (let item of data) {
    if (isEmpty(item)) {
      errors[item] = `${item} est requis`;
      break;
    }
  }
  return errors;
}
export function validatePassword(password, confpassword) {
  let errors;
  if (isEmpty(password)) {
    errors["password"] = "Le mot de passe est requis";
  } else if (password.length < 8) {
    errors["password"] = "Le mot de passe doit etre d'au moins 8 caractère";
  }
  if (!isEmpty(confpassword)) {
    if (password !== confpassword) {
      errors["password"] = "Les deux mot de passe ne corresponde pas";
    }
  }
  return errors;
}
export function varIsEmpty(value) {
  return isEmpty(value) || typeof "object"
    ? JSON.stringify(value) === "{}"
    : value.length < 1;
}
export function validateRequiredFields(data, fields) {
  let lengthFind = 0;
  for (let item of Object.keys(data)) {
    if (fields.includes(item)) {
      lengthFind++;
    }
  }
  if (lengthFind !== fields.length) {
    return;
  }
}
export function validateEmail($email) {
  let errors;

  const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/i;
  if (!emailReg.test($email)) {
    errors["email"] = "Email invalide";
  }
  return errors;
}
