export default class Validator {
  constructor() {
    this.errors = {};
  }

  isEmpty(data) {
    return (
      data === null || data === undefined || data === 0 || data.length === 0
    );
  }
  validateFormBody(data) {
    for (let item in data) {
      if (
        this.isEmpty(data[item]) ||
        (typeof data[item] === "string" && data[item].trim().length < 2)
      ) {
        this.errors["error"] = `${item} est requis`;
        break;
      }
    }
    return this;
  }
  validatePassword(password, confpassword) {
    if (this.isEmpty(password)) {
      this.errors["error"] = "Le mot de passe est requis";
    } else if (password.length < 8) {
      this.errors["error"] = "Le mot de passe doit etre d'au moins 8 caractère";
    }
    if (!this.isEmpty(confpassword)) {
      if (password !== confpassword) {
        this.errors["error"] = "Les deux mot de passe ne corresponde pas";
      }
    }
    return this;
  }
  varIsEmpty(value) {
    return this.isEmpty(value) || typeof "object"
      ? JSON.stringify(value) === "{}"
      : value.length < 1;
  }
  validateRequiredFields(data, fields) {
    let lengthFind = 0;
    for (let item of Object.keys(data)) {
      if (fields.includes(item)) {
        lengthFind++;
      }
    }
    if (lengthFind !== fields.length) {
      this.errors["error"] = "Remplissez tous les champs obligatoires";
    }
    return this;
  }
  validateEmail(email) {
    const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/i;
    if (!emailReg.test(email)) {
      this.errors["error"] = "Email invalide";
    }
    return this;
  }
}
