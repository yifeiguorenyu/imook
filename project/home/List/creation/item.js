import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Dimensions,
  AlertIOS
} from "react-native";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Title,
  Text,
  Card,
  CardItem,
  Thumbnail,
  Grid,
  Col,
  Icon
} from "native-base";
import Color from "../../../../common/color";
import request from "../../../../common/request";
import config from "../../../../common/config";
let { width, height } = Dimensions.get("window");

export default class Itmes extends Component {
  constructor(props) {
    super(props);
    const item = this.props.item;
    this.state = {
      item: item,
      up: item.voted
    };
  }
  render() {
    let { item, up } = this.state;
    return (
      <TouchableOpacity style={styles.touchable}>
        <TouchableOpacity style={styles.item} onPress={()=>this.props.ToDetail(item)}>
          <Text style={styles.Title}>{item.title}</Text>
          <Image source={{ uri: item.thumb }} style={styles.Thumb} />
          <Icon type="Ionicons" name="ios-play" size={30} style={styles.Icon} />
        </TouchableOpacity>
        <View style={styles.buttonBox}>
          <TouchableOpacity style={styles.itemBox} onPress={() => this._up()}>
            <Icon
              type="Ionicons"
              name="ios-heart"
              style={[styles.buttonBoxIcon, up ? styles.up : styles.down]}
            />
            <Text style={styles.buttonText}>点赞</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemBox}
            onPress={this.props.ToDetail}
          >
            <Icon
              type="Ionicons"
              name="ios-chatbubbles"
              style={styles.buttonBoxIcon}
            />
            <Text style={styles.buttonText}>评论</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
  componentDidMount() {}
  _up = () => {
    var item = this.state.item;
    var url = config.api.up;
    let up = !this.state.up;

    // request
    //   .post(url, {
    //     accessToken: "abd",
    //     up: "yes"
    //   })
    //   .then(response => {
    //     console.log(response);
    //   })
    //   .catch(err => console.log("err" + err))

    request
      .get(url, {
        accessToken: "abd",
        up: up ? "yes" : "no"
      })
      .then(response => {
        if (response.success) {
          this.setState({
            up
          });
        } else {
          AlertIOS.alert("点赞失败");
        }
      })
      .catch(err => {
        AlertIOS.alert("点赞失败");
        console.log("err" + err);
      });
  };
}
const styles = StyleSheet.create({
  touchable: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 14
  },
  item: {
    width: width,
    height: width * 0.56 + 60
  },
  Title: {
    width: width,
    height: 60,
    borderWidth: 1,
    borderColor: Color.paper
  },
  Thumb: {
    width: width,
    height: width * 0.56
  },
  Icon: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 46,
    height: 46,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "#ff6600",
    paddingTop: 5,
    paddingLeft: 3
  },
  itemBox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRightColor: Color.paper,
    borderRightWidth: 1
  },
  buttonBox: {
    flexDirection: "row",
    borderColor: Color.paper,
    borderWidth: 1
  },
  buttonBoxIcon: {
    marginRight: 15,
    color: "#999"
  },
  up: {
    color: "#ff6600"
  },
  down: {
    color: "#999"
  },
  buttonText: {
    color: "#999"
  }
});
