import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ActivityIndicatorIOS,
  TouchableOpacity,
  Modal,
  AlertIOS
} from "react-native";
import Video from "react-native-video";
import { Thumbnail, Icon, Button } from "native-base";
import { FlatList, TextInput } from "react-native-gesture-handler";
let { width, height } = Dimensions.get("window");
import request from "../../common/request";
import config from "../../common/config";

let casheResult = {
  nextPage: 1,
  total: 0,
  items: []
};
export default class Detail extends Component {
  constructor(props) {
    super(props);
    let item = this.props.navigation.getParam("item");
    this.state = {
      item,
      muted: true, //是否静音
      paused: false, //是否暂停
      rate: 1, //0暂停1正常
      resizeMode: "contain",
      repeat: false, //是否重复
      videoLoaded: false, //视频是否已经加载完成
      videoProgress: 0, //进度条
      videoTotal: 0, //视频总长度
      currentTime: 0, //现在播放的地方
      playing: false, //是否在播放
      videoOk: true, //视频是否出错
      data: [], //评论列表
      isLoadingTail: false, //是否正在加载
      modalVisible: false, //模态框是否可见
      content: "", //模态框里的评论的内容
      sending: false
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={this._HeaderComponet}
          ListFooterComponent={this._FooterComponent}
          ListEmptyComponent={<Text />}
          renderItem={this._renderItem}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          data={this.state.data}
          style={styles.flatList}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.2}
        />
        <Modal
        animated={true}
          animationType={"fade"}
          onRequestClose={() => {
            this._setModalVisible(false);
          }}
          visible={this.state.modalVisible}
        >
          <View style={styles.modalContainer}>
            <Icon
              name="ios-close"
              type="Ionicons"
              onPress={this._onClose}
              size={12}
              style={styles.closeIcon}
            />
            <View style={styles.commentBox}>
              <View style={styles.comment}>
                <TextInput
                  placeholder="好喜欢这个狗狗"
                  style={styles.content}
                  multiline={true}
                  style={styles.TextInput}
                  value={this.state.content}
                  onChangeText={text =>
                    this.setState({
                      content: text
                    })
                  }
                />
                <Button block style={styles.submit} onPress={this._onSubmit}>
                  <Text>提交评论</Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  _onSubmit = () => {
    //提交form表单
    if (!this.state.content) {
      return AlertIOS.alert("评论不能为空");
    }
    if (this.state.sending) {
      return AlertIOS.alert("正在发送评论");
    }
    this.setState({
      sending: true
    });
    let url = config.api.commentPost;
    // request
    //   .post(url, {
    //     accessToken: "abc",
    //     creation: "bnh",
    //     content: this.state.content
    //   })
    //   .then(res => {
    //     console.log(res);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
    //   .finally(() => {
    //     this.setState({
    //       sending: false
    //     });
    //   });
    request
    .get(url, {
      accessToken: "abc",
      creation: "bnh",
      content: this.state.content
    })
    .then(res => {
      if(res.success){
          let items =casheResult.items.slice()
          items=[{
              content:this.state.content,
              replyBy:{
                nickname:'狗狗说说',
                avatar:'http://dummyimage.com/640x640/f27a79'
              }
          }].concat(items)
         casheResult.items=items
         casheResult.total+=1
          this.setState({
              data:items,
         })
      }
    })
    .catch(err => {
      console.log(err);
      AlertIOS.alert('评论失败')
    })
    .finally(() => {
      this.setState({
        sending: false,
        modalVisible:false,
        content:''
      });
    });
  };
  _onClose = () => {
    //xx关闭模态框
    this.setState({
      modalVisible: false
    });
  };
  _onLoadStart = () => {
    //视频开始加载时
    console.log("start");
  };
  _onLoad = () => {
    //视频加载中
    console.log("load");
  };
  _onProgress = time => {
    //视频开始播放时 每250毫秒调用一次
    if (!this.state.videoLoaded) {
      this.setState({
        videoLoaded: true
      });
    }
    if (!this.state.playing) {
      this.setState({
        playing: true
      });
    }
    let videoTotal = time.seekableDuration; //总视频长度
    let currentTime = Number(time.currentTime.toFixed(2)); //当前视频长度
    let percent = Number((currentTime / videoTotal).toFixed(2));
    this.setState({
      videoTotal,
      currentTime,
      videoProgress: percent
    });
  };
  _onEnd = () => {
    //播放完毕
    this.setState({
      videoProgress: 1,
      playing: false
    });
  };
  _onError = err => {
    //视频出错
    console.log(err);
    this.setState({
      videoLoaded: true,
      videoOk: false
    });
  };

  _backToList = () => {
    //返回列表页
    this.props.navigation.pop();
  };
  _rePlay = () => {
    //重新开始播放
    this.videoPlayer.seek(0);
    this.setState({
      playing: true
    });
  };
  _pause = () => {
    //暂停播放
    this.setState({
      paused: true
    });
  };
  _resume = () => {
    //重启播放
    if (this.state.paused) {
      this.setState({
        paused: false
      });
    }
  };
  _focus = () => {
    //弹出模态框
    if (!this.state.modalVisible) {
      this.setState({
        modalVisible: true
      });
    }
  };
  _HeaderComponet = () => {
    let { title, vedioUrl, author } = this.state.item;
    return (
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={this._backToList} style={styles.backBox}>
            <Icon
              name="chevron-left"
              type="Entypo"
              size={12}
              style={styles.backIcon}
            />
            <Text style={styles.backText}>返回</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            视频详情页
          </Text>
        </View>
        <View style={styles.videoBox}>
          <Video
            ref={ref => (this.videoPlayer = ref)}
            source={{ uri: vedioUrl }}
            muted={this.state.muted} //是否静音
            volume={4} //声音放大倍数
            paused={this.state.paused} //是否暂停
            rate={this.state.rate} //0暂停1正常
            resizeMode={this.state.resizeMode}
            repeat={this.state.repeat}
            onLoadStart={this._onLoadStart} //视频开始加载时
            onLoad={this._onLoad}
            onProgress={this._onProgress} //视频开始播放时
            onEnd={this._onEnd} //视频播放结束
            onError={this._onError} //视频出错时
            style={styles.video}
          />
          {!this.state.videoOk && (
            <Text style={styles.failText}>视频出错了</Text>
          )}
          {!this.state.videoLoaded && (
            <ActivityIndicator color={"#ff6600"} style={styles.loading} />
          )}
          {this.state.videoLoaded &&
          !this.state.playing &&
          this.state.videoOk ? (
            <Icon
              name="ios-play"
              type="Ionicons"
              size={30}
              onPress={this._rePlay}
              style={styles.playIcon}
            />
          ) : null}
          {this.state.videoLoaded && this.state.playing ? (
            <TouchableOpacity onPress={this._pause} style={styles.pausedBtn}>
              {this.state.paused ? (
                <Icon
                  name="ios-play"
                  type="Ionicons"
                  size={30}
                  onPress={this._resume}
                  style={styles.playIcon}
                />
              ) : (
                <Text />
              )}
            </TouchableOpacity>
          ) : null}
          <View style={styles.progressBox}>
            <View
              style={[
                styles.progressBar,
                { width: width * this.state.videoProgress }
              ]}
            />
          </View>
        </View>
        <View style={styles.infoBox}>
          <Thumbnail source={{ uri: author.avatar }} style={styles.avatar} />
          <View style={styles.descBox}>
            <Text style={styles.nickname}>{author.nickname}</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>
        <View style={styles.commentBox}>
          <View style={styles.comment}>
            <TextInput
              placeholder="好喜欢这个狗狗"
              style={styles.content}
              multiline={true}
              onFocus={this._focus}
              style={styles.TextInput}
            />
          </View>
          <View style={styles.commentArea}>
            <Text style={styles.commentTitle}>精彩评论</Text>
          </View>
        </View>
      </View>
    );
  };
  _FooterComponent = () => {
    if (!this._isHasMore() && casheResult.total != 0) {
      return (
        <Text style={{ textAlign: "center", marginTop: 15 }}>
          没有更多数据了
        </Text>
      );
    }
    return <ActivityIndicator color={"#ff6600"} style={styles.footer} />;
  };
  _renderItem = ({ item }) => {
    let { content, replyBy } = item;
    return (
      <View style={styles.infoBox}>
        <Thumbnail
          source={{ uri: replyBy.avatar }}
          small
          style={styles.avatar}
        />
        <View style={styles.descBox}>
          <Text style={styles.nickname}>{replyBy.nickname}</Text>
          <Text style={styles.title}>{content}</Text>
        </View>
      </View>
    );
  };

  componentDidMount() {
    this._fetchData(); //获取评论
  }
  _fetchData = () => {
    this.setState({
      isLoadingTail: true
    });
    let url = config.api.comment;
    request
      .get(url, {
        accessToken: "abc",
        creation: "123"
      })
      .then(res => {
        if (res.success) {
          let data = casheResult.items.concat(res.data);
          casheResult.items = data;
          casheResult.total = res.total;
          this.setState({
            data: casheResult.items
          });
        }
      })
      .catch(err => {
        console.log("err  " + err);
      })
      .finally(() => {
        this.setState({
          isLoadingTail: false
        });
      });
  };
  _onEndReached = () => {
    if (!this._isHasMore()) {
      return;
    }
    this._fetchData();
  };
  _isHasMore = () => {
    return (
      casheResult.total !== 0 && casheResult.total !== casheResult.items.length
    );
  };
}
const styles = StyleSheet.create({
  closeIcon: {
    marginTop: 40,
    textAlign: "center"
  },
  submit: {
    marginTop: 100
  },
  modalContainer: {},
  commentTitle: {},
  commentArea: {
    width: width,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  TextInput: {},
  comment: {
    paddingLeft: 2,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 15,
    height: 80
  },
  commentBox: {
    marginVertical: 10,
    padding: 8,
    width: width
  },

  descBox: {},
  infoBox: {
    flexDirection: "row",
    marginTop: 10
  },
  avatar: {
    marginHorizontal: 10
  },
  nickname: {
    fontSize: 18
  },
  title: {
    marginTop: 8,
    color: "#666",
    fontSize: 16
  },
  flatList: {
    width: width
  },
  container: {
    alignItems: "center"
  },
  videoBox: {
    width: width,
    height: 360,
    backgroundColor: "#000"
  },
  video: {
    width: width,
    height: 360,
    backgroundColor: "#000"
  },
  loading: {
    position: "absolute",
    left: 0,
    top: 140,
    width: width,
    alignSelf: "center",
    backgroundColor: "transparent"
  },
  progressBox: {
    width: width,
    height: 2,
    backgroundColor: "#ccc"
  },
  progressBar: {
    width: 1,
    height: 2,
    backgroundColor: "#ff6600"
  },
  playIcon: {
    position: "absolute",
    width: 46,
    height: 46,
    top: 140,
    left: width / 2 - 23,
    paddingTop: 6,
    paddingLeft: 18,
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 23,
    color: "#ed7b66"
  },
  pausedBtn: {
    width: width,
    height: 360,
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "transparent"
  },
  resumeIcon: {
    position: "absolute",
    width: 46,
    height: 46,
    top: 140,
    left: width / 2 - 23,
    paddingTop: 6,
    paddingLeft: 18,
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 23,
    color: "#ed7b66"
  },
  failText: {
    textAlign: "center",
    width: width,
    color: "#fff",
    justifyContent: "center",
    fontSize: 28,
    position: "absolute",
    top: 160,
    left: 0
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: width,
    height: 64,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,.1)",
    backgroundColor: "#fff"
  },
  backBox: {
    position: "absolute",
    left: 12,
    top: 32,
    width: 50,
    flexDirection: "row",
    alignItems: "center"
  },
  backIcon: {
    color: "#999",
    fontSize: 20,
    marginRight: 5
  },
  backText: {
    color: "#999"
  },
  headerTitle: {
    width: width - 120,
    textAlign: "center"
  },
  footer: { marginTop: 15 }
});
