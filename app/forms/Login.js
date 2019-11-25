import React from "react";
import t from "tcomb-form-native";
import formValidations from "../utils/Validations";
import inputTemplate from "./templates/Input";

export const LoginStruct = t.struct({
  email: formValidations.email,
  password: formValidations.password
});

export const LoginOptions = {
  fields: {
    email: {
      template: inputTemplate,
      config: {
        placeholder: "Escribe tu email",
        iconType: "material-community",
        iconName: "at"
      }
    },
    password: {
      template: inputTemplate,
      config: {
        placeholder: "Escribe tu contraseña",
        iconType: "material-community",
        iconName: "lock-outline",
        password: true,
        secureTextEntry: true
      }
    }
  }
};
