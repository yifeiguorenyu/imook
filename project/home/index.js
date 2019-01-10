import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { createBottomTabNavigator } from "react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";

import List from "./List";
import Account from "./Account";
import Edit from "./Edit";

import color from "../../common/color";

const BottomTabNavigator = createBottomTabNavigator(
  {
    List: {
      screen: List,
      navigationOptions: {
        title: "列表"
      }
    },
   
    Edit: {
      screen: Edit,
      navigationOptions: {
        title: "编辑"
      }
    },
    Account: {
      screen: Account,
      navigationOptions: {
        title: "账户"
      }
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "List") {
          iconName = `ios-videocam`;
        } else if (routeName === "Account") {
          iconName = `ios-more`;
        } else if (routeName == "Edit") {
          iconName = `ios-recording`;
        }
        return (
          <Ionicons
            name={iconName}
            size={horizontal ? 26 : 25}
            color={tintColor}
          />
        );
      }
    }),
    tabBarOptions: {
      activeTintColor: color.primary,
      inactiveTintColor: color.gray
    },
    style: {
      fontSize: 30
    }
  }
);
export default BottomTabNavigator;
