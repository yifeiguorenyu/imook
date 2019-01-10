import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import * as Progress from 'react-native-progress';
export default class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text>编辑</Text>
      </View>
    );
  }
}

const styles=StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
  }
})