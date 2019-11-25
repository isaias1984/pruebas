import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Avatar, Button } from "react-native-elements";
import Toast, { DURATION } from "react-native-easy-toast";

import UpdateUserInfo from "./UpdateUserInfo";

import * as firebase from "firebase";

import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

import SolucionTimer from "../../../lib/SolucionTimer";

export default class UserInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props,
      userInfo: {}
    };
  }

  componentDidMount = async () => {
    await this.getUserInfo();
  };

  getUserInfo = () => {
    const user = firebase.auth().currentUser;

    user.providerData.forEach(userInfo => {
      this.setState({
        userInfo
      });
    });
  };

  reauthenticate = currentPassword => {
    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateWithCredential(credential);
  };

  checkUserAvatar = photoUrl => {
    return photoUrl
      ? photoUrl
      : "https://api.adorable.io/avatars/285/abott@adorable.png";
  };

  updateUserDisplayName = async newDisplayName => {
    const update = {
      displayName: newDisplayName
    };

    await firebase.auth().currentUser.updateProfile(update);

    this.getUserInfo();
  };

  updateUserEmail = async (newEmail, password) => {
    this.reauthenticate(password)
      .then(() => {
        const user = firebase.auth().currentUser;
        user
          .updateEmail(newEmail)
          .then(() => {
            this.refs.toast.show(
              "Email actualizado, vuelve a iniciar sesión",
              50,
              () => {
                firebase.auth().signOut();
              }
            );
          })
          .catch(err => {
            this.refs.toast.show(err, 1500);
          });
      })
      .catch(err => {
        this.refs.toast.show("Tu contraseña no es correcta", 1500);
      });
  };

  updateUserPassword = async (currentPassword, newPassword) => {
    this.reauthenticate(currentPassword)
      .then(() => {
        const user = firebase.auth().currentUser;

        user
          .updatePassword(newPassword)
          .then(() => {
            this.refs.toast.show(
              "Contraseña actualizada correctamente, vuelve a iniciar sesión",
              50,
              () => {
                firebase.auth().signOut();
              }
            );
          })
          .catch(() => {
            this.refs.toast.show(
              "Error del servidor, inténtelo más tarde",
              1500
            );
          });
      })
      .catch(() => {
        this.refs.toast.show(
          "Tu contraseña actual introducida no es correcta",
          1500
        );
      });
  };

  returnUpdateUserInfoComponent = userInfoData => {
    if (userInfoData.hasOwnProperty("uid")) {
      return (
        <UpdateUserInfo
          userInfo={this.state.userInfo}
          updateUserDisplayName={this.updateUserDisplayName}
          updateUserEmail={this.updateUserEmail}
          updateUserPassword={this.updateUserPassword}
        />
      );
    }
  };

  updateUserPhotoURL = async photoUri => {
    const update = {
      photoURL: photoUri
    };

    await firebase.auth().currentUser.updateProfile(update);

    this.getUserInfo();
  };

  changeAvatarUser = async () => {
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (resultPermission.status === "denied") {
      this.refs.toast.show(
        "Es necesario aceptar los permisos de la galeria",
        1500
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      if (result.cancelled) {
        this.refs.toast.show("Has cerrado la galería de imágenes", 1500);
      } else {
        const { uid } = this.state.userInfo;

        this.uploadImage(result.uri, uid)
          .then(resolve => {
            this.refs.toast.show("Avatar Actualizado Correctament...");
            firebase
              .storage()
              .ref("avatar/" + uid)
              .getDownloadURL()
              .then(resolve => {
                console.log(resolve);
                this.updateUserPhotoURL(resolve);
              })
              .catch(error => {
                this.refs.toast.show(
                  "Error al recuperar el avatar del servidor"
                );
              });
          })
          .catch(error => {
            this.refs.toast.show(
              "Error al actualizar el avatar, inténtelo más tarde"
            );
          });
      }
    }
  };

  uploadImage = async (uri, nameImage) => {
    await fetch(uri)
      .then(async result => {
        let ref = firebase
          .storage()
          .ref()
          .child("avatar/" + nameImage);

        return await ref.put(result._bodyBlob);
      })
      .catch(error => {
        this.refs.toast.show(
          "Error al subir la imagen al servidor, inténtelo más tarde",
          1500
        );
      });
  };

  render() {
    const { displayName, email, photoURL } = this.state.userInfo;

    return (
      <View>
        <View style={styles.viewUserInfo}>
          <Avatar
            rounded
            size="large"
            showEditButton
            onEditPress={() => this.changeAvatarUser()}
            source={{
              uri: this.checkUserAvatar(photoURL)
            }}
            containerStyle={styles.userInfoAvatar}
          />
          <View>
            <Text style={styles.displayName}>{displayName}</Text>
            <Text>{email}</Text>
          </View>
        </View>
        {this.returnUpdateUserInfoComponent(this.state.userInfo)}
        <Button
          title="Cerrar Sesión"
          onPress={() => firebase.auth().signOut()}
          buttonStyle={styles.btnCloseSession}
          titleStyle={styles.btnCloseSessionText}
        />
        <Toast
          ref="toast"
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
  viewUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: "#f2f2f2"
  },
  userInfoAvatar: {
    marginRight: 20
  },
  displayName: {
    fontWeight: "bold"
  },
  btnCloseSession: {
    marginTop: 30,
    borderRadius: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e3e3e3",
    padding: 15
  },
  btnCloseSessionText: {
    color: "#00a680"
  }
});
