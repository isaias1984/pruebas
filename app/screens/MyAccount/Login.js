import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Image, Button, SocialIcon, Divider } from "react-native-elements";
import { ActivityIndicator } from "react-native";
import Toast, { DURATION } from "react-native-easy-toast";

import t from "tcomb-form-native";
const Form = t.form.Form;

import { LoginStruct, LoginOptions } from "../../forms/Login";

import * as firebase from "firebase";
import { FacebookApi } from "../../utils/Social";

import * as Facebook from "expo-facebook";

export default class Login extends Component {
  constructor() {
    super();

    this.state = {
      loginStruct: LoginStruct,
      loginOptions: LoginOptions,
      loginData: {
        email: "",
        password: ""
      },
      loginErrorMessage: ""
    };
  }

  login = () => {
    const validate = this.refs.loginForm.getValue();

    if (!validate) {
      this.setState({
        loginErrorMessage: "Los datos del formulario son erroneos"
      });
    } else {
      this.setState({
        loginErrorMessage: ""
      });

      firebase
        .auth()
        .signInWithEmailAndPassword(validate.email, validate.password)
        .then(() => {
          this.refs.toastLogin.show("Login Correcto", 200, () => {
            this.props.navigation.goBack();
          });
        })
        .catch(error => {
          this.refs.toastLogin.show("Login Incorrecto revise sus datos", 2500);
        });
    }
  };

  loginFacebook = async () => {
    const {
      type,
      token
    } = await Facebook.logInWithReadPermissionsAsync(
      FacebookApi.application_id,
      { permissions: FacebookApi.permisions }
    );

    if (type == "success") {
      const credentials = firebase.auth.FacebookAuthProvider.credential(token);
      firebase
        .auth()
        .signInWithCredential(credentials)
        .then(() => {
          this.refs.toastLogin.show("Login correcto", 100, () => {
            this.props.navigation.goBack();
          });
        })
        .catch(error => {
          this.refs.toastLogin.show(
            "Error accediendo con Facebook, intentalo más tarde",
            300
          );
        });
    } else if (type == "cancel") {
      this.refs.toastLogin.show("Inicio de sesión cancelado", 300);
    } else {
      this.refs.toastLogin.show("Error desconocido, intentalo más tarde", 300);
    }

    console.log(type);
    console.log(token);
  };

  onChangeFormLogin = formValue => {
    this.setState({
      loginData: formValue
    });
  };

  render() {
    const { loginStruct, loginOptions, loginErrorMessage } = this.state;

    return (
      <View style={styles.viewBody}>
        <Image
          source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
          style={styles.logo}
          PlaceholderContent={<ActivityIndicator />}
          resizeMode="contain"
          containerStyle={styles.logoContainer}
        />
        <View style={styles.viewForm}>
          <Form
            ref="loginForm"
            type={loginStruct}
            options={loginOptions}
            value={this.state.loginData}
            onChange={formValue => this.onChangeFormLogin(formValue)}
          />
          <Button
            buttonStyle={styles.buttonLoginContainer}
            title="Login"
            onPress={() => this.login()}
          />

          <Text style={styles.textRegister}>
            ¿Aún no tienes una cuenta?{" "}
            <Text
              style={styles.btnRegister}
              onPress={() => this.props.navigation.navigate("Register")}
            >
              {" "}
              Regístrate{" "}
            </Text>
          </Text>

          <Divider style={styles.divider} />
          <SocialIcon
            title="Iniciar sesión con Facebook"
            button
            type="facebook"
            onPress={() => this.loginFacebook()}
          />
          <Text style={styles.loginErrorMessage}>{loginErrorMessage}</Text>
        </View>
        <Toast
          ref="toastLogin"
          position="bottom"
          positionValue={250}
          fadeInDuration={1000}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "#fff" }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    marginLeft: 40,
    marginRight: 40,
    marginTop: 20
  },
  logo: {
    width: 325,
    height: 130
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  viewForm: {
    marginTop: 20
  },
  buttonLoginContainer: {
    backgroundColor: "#00a680",
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20
  },
  loginErrorMessage: {
    color: "#f00",
    textAlign: "center",
    marginTop: 10
  },
  divider: {
    backgroundColor: "#00a680",
    marginTop: 10,
    marginBottom: 10
  },
  textRegister: {
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 10
  },
  btnRegister: {
    color: "#00a680",
    fontWeight: "bold"
  }
});
