import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title
} from "native-base";
import ListItems from "./creation/item";
import request from "../../../common/request";
import config from "../../../common/config";

const cachesResult = {
  nextPage: 1,
  items: [],
  total: 0
};
export default class Creation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoadingTail: false, //是否正在加载
      isRefreshing: false //是否正在下拉刷新
    };
  }
  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "#ee735c" }}>
          <Left />
          <Body>
            <Title>列表页面</Title>
          </Body>
          <Right />
        </Header>
        <FlatList
          data={this.state.data}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <ListItems item={item} ToDetail={this._ToDetail} />
          )}
          ListEmptyComponent={<Text />}
          ListFooterComponent={this._footComponent}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={0.02}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          refreshControl={
            <RefreshControl
              title={"拼命加载中"}
              color={"red"}
              refreshing={this.state.isRefreshing}
              onRefresh={() => {
                this._refresh();
              }}
            />
          }
        />
      </Container>
    );
  }
  _ToDetail = (item) => {
    //去详情页面
    this.props.navigation.navigate("Detail",{
      item
    });
  };
  componentDidMount() {
    //获取列表数据
    this._fetchData(1);
  }
  _fetchData = page => {
    //获取列表数据
    if (page != 0) {
      this.setState({
        isLoadingTail: true
      });
    } else {
      this.setState({
        isRefreshing: true
      });
    }

    request
      .get(config.api.creations, {
        accessToken: "abc",
        page: page
      })
      .then(response => {
        if (response.success) {
          let items = cachesResult.items.slice();
          if (page != 0) {
            cachesResult.nextPage+=1
            items = items.concat(response.data);
          } else {
            items = response.data.concat(items);
          }
          cachesResult.items = items;
          cachesResult.total = response.total;
          this.setState({
            data: items
          });
        }
      })
      .catch(err => console.log("err" + err))
      .finally(() => {
        if (page != 0) {
          this.setState({
            isLoadingTail: false
          });
        } else {
          this.setState({
            isRefreshing: false
          });
        }
      });
  };
  _fetchMoreData = () => {
    if (!this._hasMore() || this.state.isLoadingTail) {
      return;
    }
    let page = cachesResult.nextPage;
    this._fetchData(page);
  };
  _hasMore = () => {
    //是否还有更多数据
    return cachesResult.items.length !== cachesResult.total;
  };
  _footComponent = () => {
    //
    if (!this._hasMore() && cachesResult.total != 0) {
      return (
        <Text style={{ textAlign: "center", marginTop: 15 }}>
          没有更多数据了
        </Text>
      );
    }
    return <ActivityIndicator color={"#ff6600"} style={styles.footer} />;
  };
  _refresh = () => {
    //下拉刷新
    if(!this._hasMore()||this.state.isRefreshing){
      return
    }
    this._fetchData(0);
  };
}
const styles = StyleSheet.create({
  footer: { marginTop: 15 }
});
