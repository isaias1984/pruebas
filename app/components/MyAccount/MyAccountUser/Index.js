import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

import UserInfo from "./UserInfo";

export default class MyAccountUser extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.viewUserAccount}>
        <UserInfo />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewUserAccount: {
    backgroundColor: "#f2f2f2",
    height: "100%"
  }
});
