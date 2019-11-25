import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Overlay, Input, Button, Icon } from "react-native-elements";

export default class OverlayThreeInputs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props
    };
  }

  onChangeInputOne = inputData => {
    this.setState({
      inputValueOne: inputData
    });
  };

  onChangeInputTwo = inputData => {
    this.setState({
      inputValueTwo: inputData
    });
  };

  onChangeInputThree = inputData => {
    this.setState({
      inputValueThree: inputData
    });
  };

  update = () => {
    const newValueOne = this.state.inputValueOne;
    const newValueTwo = this.state.inputValueTwo;
    const newValueThree = this.state.inputValueThree;

    this.state.updateFunction(newValueOne, newValueTwo, newValueThree);

    this.setState({
      isVisibleOverlay: false
    });
  };

  close = () => {
    this.setState({
      isVisibleOverlay: false
    });
    this.state.updateFunction(null);
  };

  render() {
    const {
      isVisibleOverlay,
      placeholderOne,
      placeholderTwo,
      placeholderThree,
      inputValueOne,
      inputValueTwo,
      inputValueThree,
      isPassword
    } = this.state;

    return (
      <Overlay
        isVisible={isVisibleOverlay}
        fullScreen={true}
        overlayBackgroundColor="transparent"
        overlayStyle={styles.overlayStyle}
      >
        <View style={styles.viewOverlay}>
          <Input
            containerStyle={styles.inputContainer}
            placeholder={placeholderOne}
            onChangeText={value => this.onChangeInputOne(value)}
            value={inputValueOne}
            pasword={isPassword}
            secureTextEntry={isPassword}
          />
          <Input
            containerStyle={styles.inputContainer}
            placeholder={placeholderTwo}
            onChangeText={value => this.onChangeInputTwo(value)}
            value={inputValueTwo}
            pasword={isPassword}
            secureTextEntry={isPassword}
          />
          <Input
            containerStyle={styles.inputContainer}
            placeholder={placeholderThree}
            onChangeText={value => this.onChangeInputThree(value)}
            value={inputValueThree}
            pasword={isPassword}
            secureTextEntry={isPassword}
          />
          <Button
            buttonStyle={styles.btnUpdate}
            title="Actualizar"
            onPress={() => this.update()}
          />
          <Icon
            containerStyle={styles.containerIconClose}
            type="material-community"
            name="close-box"
            size={30}
            color="#00a680"
            onPress={() => this.close()}
          />
        </View>
      </Overlay>
    );
  }
}

const styles = StyleSheet.create({
  overlayStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  viewOverlay: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderColor: "#00a680",
    borderWidth: 2
  },
  inputContainer: {
    marginBottom: 20
  },
  btnUpdate: {
    backgroundColor: "#00a680"
  },
  containerIconClose: {
    position: "absolute",
    right: 0,
    top: 0
  }
});
