import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Image, Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Toast, { DURATION } from "react-native-easy-toast";
import { uploadImage } from "../../utils/UploadImage";

import t from "tcomb-form-native";
const Form = t.form.Form;
import {
  AddRestaurantStruct,
  AddRestaurantOptions
} from "../../forms/AddRestaurant";

import { firebaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default class AddRestaurant extends Component {
  constructor() {
    super();

    this.state = {
      imageUriRestaurant: "",
      formData: {
        name: "",
        city: "",
        address: "",
        description: ""
      }
    };
  }

  isImageRestaurant = image => {
    return image ? (
      <Image source={{ uri: image }} style={{ width: 150, height: 150 }} />
    ) : (
      <Image
        source={require("../../../assets/img/no-image.png")}
        style={{ width: 150, height: 150 }}
      />
    );
  };

  uploadImage = async () => {
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
        allowsEditing: true
      });

      if (result.cancelled) {
        this.refs.toast.show("Has cerrado la galeria de imágenes", 1500);
      } else {
        this.setState({ imageUriRestaurant: result.uri });
      }
    }
  };

  onChangeFormAddRestaurant = formValue => {
    this.setState({
      formData: formValue
    });
  };

  addRestaurant = () => {
    const { imageUriRestaurant } = this.state;
    const { name, city, address, description } = this.state.formData;

    uploadImage(imageUriRestaurant, "mifotorestaurante", "restaurants")
      .then(resolve => {
        console.log(resolve);
      })
      .catch(error => {
        console.log("ERROR");
      });

    /* if (imageUriRestaurant && name && city && address && description) {
      db.collection("restaurants")
        .add({ name, city, address, description, image: "" })
        .then(resolve => {
          const restaurantId = resolve.id;

          uploadImage(imageUriRestaurant, restaurantId, "restaurants")
            .then(resolve => {
              console.log(resolve);

              const restaurantRef = db
                .collection("restaurants")
                .doc(restaurantId);

              restaurantRef
                .update({ image: resolve })
                .then(() => {
                  this.refs.toast.show("Restaurante creado correctamente");
                })
                .catch(() => {
                  this.refs.toast.show(
                    "Error de servidor inténtelo más tarde 3"
                  );
                });
            })
            .catch(() => {
              this.refs.toast.show("Error de servidor inténtelo más tarde 2");
            });
        })
        .catch(() => {
          this.refs.toast.show("Error de servidor, inténtelo más tarde 1");
        });
    } else {
      this.refs.toast.show("Tienes que rellenar todos los campos");
    } */
  };

  render() {
    const { imageUriRestaurant } = this.state;

    return (
      <View style={styles.viewBody}>
        <View style={styles.viewPhoto}>
          {this.isImageRestaurant(imageUriRestaurant)}
        </View>
        <View>
          <Form
            ref="addRestaurantForm"
            type={AddRestaurantStruct}
            options={AddRestaurantOptions}
            value={this.state.formData}
            onChange={formValue => this.onChangeFormAddRestaurant(formValue)}
          />
        </View>
        <View style={styles.viewIconUploadPhoto}>
          <Icon
            name="camera"
            type="material-community"
            color="#7a7a7a"
            iconStyle={styles.addPhotoIcon}
            onPress={() => this.uploadImage()}
          />
        </View>
        <View style={styles.viewBtnAddRestaurant}>
          <Button
            title="Crear Restaurante"
            onPress={() => {
              this.addRestaurant();
            }}
            buttonStyle={styles.btnAddRestaurant}
          />
        </View>
        <Toast
          ref="toast"
          position="bottom"
          positionValue={240}
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
    flex: 1
  },
  viewPhoto: {
    alignItems: "center",
    height: 150,
    marginBottom: 10,
    marginTop: 10
  },
  viewIconUploadPhoto: {
    flex: 1,
    alignItems: "flex-start",
    marginLeft: 12
  },
  addPhotoIcon: {
    backgroundColor: "#e3e3e3",
    padding: 17,
    paddingBottom: 14,
    margin: 0
  },
  viewBtnAddRestaurant: {
    flex: 1,
    justifyContent: "flex-end"
  },
  btnAddRestaurant: {
    backgroundColor: "#00a680",
    marginBottom: 10,
    marginRight: 100,
    marginLeft: 100
  }
});
