import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  AlertIOS,
  AsyncStorage,
  TouchableOpacity,
  Dimensions,
  Modal,
  ImageBackground
} from "react-native";
import { Icon, Avatar ,Button} from "react-native-elements";
import * as Progress from "react-native-progress";
import ImagePicker from "react-native-image-picker";
import sha1 from "sha1";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from "react-native-simple-radio-button";
let { width, height } = Dimensions.get("window");
import request from "../../../common/request";
import config from "../../../common/config";
var radio_props = [
  {label: '男', value: 0 },
  {label: '女', value: 1 }
];
var CLOUDINARY = {
  cloud_name: "yifei",
  api_key: "296748818657115",
  api_secret: "-jdKfKjbiDKH29V357Ms3YmQgBY",
  base: "http://res.cloudinary.com/yifei",
  BasedeliveryURL: "http://res.cloudinary.com/yifei",
  SecuredeliveryURL: "https://res.cloudinary.com/yifei",
  APIBaseURL: "https://api.cloudinary.com/v1_1/yifei",
  image: "https://api.cloudinary.com/v1_1/yifei/image/upload"
};

function avatar(id, type) {
  if (id.indexOf("http") > -1) {
    return id;
  }
  if (id.indexOf("data:image") > -1) {
    return id;
  }
  return CLOUDINARY.base + "/" + type + "/upload/" + id;
}
export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      avatarProgress: 0,
      avatarUploading: false,
      modalVisible: false
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>我的账户</Text>
          <Text style={styles.toolbarEdit} onPress={this._edit}>
            编辑
          </Text>
        </View>
        {this.state.user.avatar ? (
          <TouchableOpacity
            style={[styles.avatarContainer, { backgroundColor: "red" }]}
          >
            <ImageBackground
              source={{ uri: avatar(this.state.user.avatar, "image") }}
              style={{ width: "100%", height: "100%" }}
            />
            {this.state.avatarUploading ? (
              <Progress.Circle
                showsText={true}
                size={80}
                style={styles.progress}
                progress={this.state.avatarProgress}
              />
            ) : (
              <Avatar
                large
                source={{ uri: avatar(this.state.user.avatar, "image") }}
                rounded
                onPress={this._ImagePicker}
                activeOpacity={0.7}
                containerStyle={{ position: "absolute" }}
              />
            )}

            <Text style={styles.imgText}>点这里换头像</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarTip}>添加狗狗头像</Text>
            <TouchableOpacity
              style={styles.avatarBox}
              onPress={this._ImagePicker}
            >
              <Icon
                type="ionicons"
                name="cloud-upload"
                color="#999"
                size={40}
                containerStyle={styles.Icon}
              />
            </TouchableOpacity>
          </View>
        )}
         <Button title="退出"  onPress={this._loginOut} />
        <Modal animationType={"fade"} visible={this.state.modalVisible}>
          <View style={styles.modalContainer}>
            <Icon
              name="close"
              type={"ionicons"}
              style={styles.closeIcon}
              onPress={this._closeModal}
            />
            <View style={styles.fieldItem}>
              <Text style={styles.label}>昵称</Text>
              <TextInput
                placeholder={"输入的昵称"}
                style={styles.inputField}
                autoCapitalize={"none"}
                autoCorrect={false}
                defaultValue={this.state.user.nickname}
                onChangeText={text => {
                  this._changeUseState("nickname", text);
                }}
              />
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.label}>狗狗品种</Text>
              <TextInput
                placeholder={"狗狗的品种"}
                style={styles.inputField}
                autoCapitalize={"none"}
                autoCorrect={false}
                defaultValue={this.state.user.greed}
                onChangeText={text => {
                  this._changeUseState("greed", text);
                }}
              />
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.label}>狗狗年龄</Text>
              <TextInput
                placeholder={"狗狗的年龄"}
                style={styles.inputField}
                autoCapitalize={"none"}
                autoCorrect={false}
                defaultValue={this.state.user.age}
                onChangeText={text => {
                  this._changeUseState("age", text);
                }}
              />
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.label}>狗狗性别</Text>
              <RadioForm
                radio_props={radio_props}
                initial={this.state.user.gender=='男'?0:1}
                onPress={this._Radio}
                formHorizontal={true}
              />
            </View>
            <Button title="确认修改"  onPress={this._submit} />
          </View>
        
        </Modal>
      </View>
    );
  }
  _submit=()=>{
    var user =this.state.user
   this._asyncUser()
  }
  _Radio=(text)=>{
    let user=this.state.user
    if(text=0){
      user.gender='男'
    }else{
      user.gender='女'
    }
    this.setState({user})
  }
  _edit = () => {
    this.setState({
      modalVisible: true
    });
  };
  _closeModal = () => {
    this.setState({
      modalVisible: false
    });
  };
  _loginOut=()=>{//退出登录
    AsyncStorage.removeItem('user')
    this.props.navigation.navigate('Login')
    this.setState({
      user:{}
    })
  }
  _changeUseState = (attr, value) => {
    let user = this.state.user;
    user[attr] = value;
    this.setState({
      user
    });
  };
  _upLoad = () => {
    console.log(987);
  };
  componentDidMount() {
    this._getUser();
  }
  _getUser = () => {
    AsyncStorage.getItem("user")
      .then(res => {
        if (res) {
          res = JSON.parse(res);
          this.setState({
            user: res
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  _ImagePicker = () => {
    let user = this.state.user;
    user.avatar =
      "https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=3581792254,1787772481&fm=173&app=25&f=JPEG?w=218&h=146&s=DBACB7475B8662D2062E5B6D0300E068";

    let timestamp = Date.now();
    let tags = "app,avatar";
    let folder = "gougoushuo";
    let signatureURL = config.api.signature;
    let accessToken = this.state.user.accessToken;
    // request.post(signatureURL,{
    //   accessToken,
    //   timestamp:timestamp,
    //   type:'avatar'
    // }).then((data)=>{
    //   if(data&&data.success){
    //     console.log(data)
    //     var signature='folder='+folder+'&tags='+tags+'&timestamp='+timestamp+CLOUDINARY.api_key
    //     signature=sha1(signature)

    //     let body=new FormData()
    //     body.append('folder',folder)
    //     body.append('signature')
    //     body.append('tags',tags)
    //     body.append('api_key',CLOUDINARY.api_key)
    //     body.append('resouce_type','image')
    //     body.append('file',user.avatar)
    //     this._upLoad(body)
    //   }
    // })

    request
      .get(signatureURL, {
        accessToken,
        timestamp: timestamp,
        type: "avatar"
      })
      .then(data => {
        if (data && data.success) {
          var folder = "gougoushuo";
          var tags = "app,avatar";
          var timestamp = Date.now();
          var signature =
            "folder=" +
            folder +
            "&tags=" +
            tags +
            "&timestamp=" +
            timestamp +
            CLOUDINARY.api_secret;
          signature = sha1(signature);
          var body = new FormData();
          body.append("signature", signature);
          body.append("folder", folder);
          body.append("tags", tags);
          body.append("timestamp", timestamp);
          body.append("api_key", CLOUDINARY.api_key);
          body.append("resource_type", "image");
          body.append("file", this.state.user.avatar);

          this._upLoad(body);
        }
      });

    // const options = {
    //   title:'选取相片或视屏',
    //   cancelButtonTitle:'取消',
    //   takePhotoButtonTitle:'照相',
    //   chooseFromLibraryButtonTitle:'从相机选取',
    //   quality: 1.0,
    //   maxWidth: 500,
    //   maxHeight: 500,
    //   storageOptions: {
    //     skipBackup: true,
    //   },
    // };

    // ImagePicker.showImagePicker(options, (response) => {
    //   console.log('Response = ', response);

    //   if (response.didCancel) {
    //     return
    //   } else if (response.error) {
    //     console.log('ImagePicker Error: ', response.error);
    //   } else if (response.customButton) {
    //     console.log('User tapped custom button: ', response.customButton);
    //   } else {
    //     let source = { uri: 'data:image/jpeg;base64,' + response.data };
    //     let user=this.state.user
    //     user.avatar=source
    //     this.setState({user})
    //     // You can also display the image using data:
    //     // let source = { uri: 'data:image/jpeg;base64,' + response.data };
    //   }
    // });
  };
  _upLoad = body => {
    let xhr = new XMLHttpRequest();
    let url = CLOUDINARY.image;
    this.setState({
      avatarUploading: true,
      avatarProgress: 0
    });
    xhr.open("POST", url);
    xhr.onload = () => {
      if (xhr.status !== 200) {
        console.log(xhr.responseText);
        return AlertIOS.alert("请求失败");
      }
      if (!xhr.responseText) {
        return;
      }
      var response;
      try {
        response = JSON.parse(xhr.responseText);
      } catch (error) {
        console.log(error);
      }

      if (response && response.public_id) {
        let user = this.state.user;
        user.avatar = response.public_id;
        this.setState({
          user: user,
          avatarProgress: 0,
          avatarUploading: false
        });
        this._asyncUser(true);
      }
    };
    if (xhr.upload) {
      xhr.upload.onprogress = event => {
        if (event.lengthComputable) {
          let percent = Number((event.loaded / event.total).toFixed(2));
          this.setState({
            avatarProgress: percent
          });
        }
      };
    }
    xhr.send(body);
  };
  _asyncUser = isAvatar => {
    var user = this.state.user;
    if (user && user.accessToken) {
      let url = config.api.update;
      if (isAvatar) {
        user.avatar = user;
      }
      // request.post(url,user)
      // .then(data=>{
      //   if(data&&data.success){
      //     var user =data.data
      //     if(isAvatar){
      //         AlertIOS.alert('头像更新成功')
      //     }
      //     this.setState({
      //       user:user
      //     })
      //   }
      // })
      request.get(url, user).then(data => {
        if (data && data.success) {
          var user = data.data;
          if (isAvatar) {
            console.log("头像更新成功");
          }
          this.setState(
            {
              user: user,
              modalVisible:false
            },
            () => {
              AsyncStorage.setItem("user", JSON.stringify(user));
            }
          );
        }
      });
    }
  };
}
const styles = StyleSheet.create({
  label: {
    color: "#eee",
    marginRight: 10
  },
  fieldItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: "#eee",
    borderBottomWidth: 1
  },
  inputField: {
    height: 50,
    flex: 1,
    color: "#666",
    fontSize: 14
  },
  closeIcon: {
    position: "absolute",
    width: 40,
    height: 40,
    fontSize: 32,
    right: 0,
    top: 30,
    color: "#ee735c"
  },
  modalContainer: {
    flex: 1,
    paddingTop: 50
  },
  container: {
    flex: 1
  },
  toolbar: {
    flexDirection: "row",
    paddingTop: 35,
    paddingBottom: 12,
    backgroundColor: "#ee735c"
  },
  toolbarTitle: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    fontWeight: "600"
  },
  avatarContainer: {
    width: width,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee"
  },
  avatarTip: {
    alignItems: "center"
  },
  avatarBox: {
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  Icon: {
    padding: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 5
  },
  imgText: {
    position: "absolute",
    bottom: 20
  },
  progress: {
    position: "absolute",
    left: width / 2 - 50,
    top: 20
  },
  toolbarEdit: {
    position: "absolute",
    right: 20,
    top: 35,
    color: "#fff",
    fontWeight: "600",
    fontSize: 14
  }
});
