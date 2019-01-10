import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  AlertIOS,
  Dimensions,
  AsyncStorage
} from "react-native";
let { width, height } = Dimensions.get("window");
import { Button } from "react-native-elements";
import request from "../../../common/request";
import config from "../../../common/config";
import CoutDown from "../../../common/coutdown";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      codeSent: false,
      verifyCode: "",
      countingDone: false,
      count: 60,
      timer: null
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.signupBox}>
          <Text style={styles.title}>快速登录</Text>
          <TextInput
            placeholder="输入手机号"
            style={styles.InputField}
            keyboardType={"number-pad"}
            autoCapitalize={"none"}
            autoCorrect={false}
            defaultValue={this.state.phoneNumber}
            onChangeText={text => {
              this.setState({
                phoneNumber: text
              });
            }}
          />
          {this.state.codeSent ? (
            <View style={styles.verifyCode}>
              <TextInput
                placeholder="输入验证码"
                style={styles.InputField}
                keyboardType={"number-pad"}
                autoCapitalize={"none"}
                onChangeText={text => {
                  this.setState({
                    verifyCode: text
                  });
                }}
              />
              {this.state.countingDone ? (
                <Button title="获取验证码" onPress={this._sendVerifyCode} />
              ) : (
                <Text
                  style={{
                    position: "absolute",
                    color: "red",
                    width: 20,
                    height: 20,
                    right: 0,
                    top: 0
                  }}
                >
                  {this.state.count}
                </Text>
              )}
            </View>
          ) : null}
          {this.state.codeSent ? (
            <Button
              containerViewStyle={{ borderRadius: 4 }}
              borderRadius={4}
              backgroundColor="#172c86bf"
              title="登录"
              onPress={this._onSubmit}
            />
          ) : (
            <Button
              title="获取验证码"
              borderRadius={4}
              containerViewStyle={{ borderRadius: 4 }}
              onPress={this._sendVerifyCode}
            />
          )}
        </View>
      </View>
    );
  }
  _onSubmit = () => {
    //登录
    request
      .get(config.api.login, {
        phoneNumber: this.state.phoneNumber,
        verifyCode: "12333"
      })
      .then(res => {
        if (res.success) {
          let user = {};
          user.avatar = res.data.avatar;
          user.nickname = res.data.nickname;
          user.accessToken = res.data.accessToken;
          user = JSON.stringify(user);
          AsyncStorage.setItem("user", user)
            .then(() => {
              this.setState({
                phoneNumber: "",
                codeSent: false,
                verifyCode: "",
                countingDone: false,
                count: 60,
                timer: null
              });
              this.props.navigation.navigate("Home");
            })
            .catch(err => {
              console.log(err);
            });
        } else {
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  _setTimer = () => {
    this.state.timer = setInterval(() => {
      if (this.state.count == 0) {
        clearInterval(this.state.timer);
        this.setState({
          count: 60
        });
      } else {
        this.setState({
          count: this.state.count - 1
        });
      }
    }, 1000);
  };
  _sendVerifyCode = () => {
    //获取验证码
    let phoneNumber = this.state.phoneNumber;
    if (!phoneNumber) {
      return AlertIOS.alert("手机号码不能为空");
    }
    // request
    //   .post(config.api.signup, {
    //     phoneNumber: this.state.phoneNumber
    //   })
    //   .then(res => {
    //     console.log(res);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
    request
      .get(config.api.signup, {
        phoneNumber: this.state.phoneNumber
      })
      .then(res => {
        if (res.success) {
          this.setState(
            {
              codeSent: true
            },
            () => {
              this._setTimer();
            }
          );
        } else {
          this.setState({
            codeSent: false
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  componentDidMount() {}
}

const styles = StyleSheet.create({
  cd: {},
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f9f9f9"
  },
  signupBox: {
    marginTop: 30
  },
  title: {
    marginBottom: 20,
    color: "#333",
    fontSize: 20,
    textAlign: "center"
  },
  InputField: {
    width: width - 20,
    height: 40,
    paddingLeft: 10,
    color: "#000",
    backgroundColor: "#fff",
    borderColor: "#eee",
    borderWidth: 1,
    marginBottom: 10
  },
  verifyCode: {}
});
