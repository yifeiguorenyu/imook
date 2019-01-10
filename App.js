import { createStackNavigator, createAppContainer } from "react-navigation";
import React,{ Component } from "react";
import Home from "./project/home";
import Detail from "./project/detail";
import Login from "./project/home/Account/login";
import { AsyncStorage } from "react-native";
import { Root } from "native-base";

function Tab(initialRouteName){
  return(
    createAppContainer(createStackNavigator(
      {
        Home: Home,
        Detail: Detail,
        Login: Login
      },
      {
        initialRouteName: initialRouteName,
        headerMode: "none"
      }
    ))
  )
}


class StackTab extends Component {
  constructor(props){
    super(props)
    this.state={
      initialRouteName:'Login'
    }
  }
  async _removeUser(){
    try {
      await AsyncStorage.removeItem('user')
    } catch (error) {
      console.log(error)
    }
  }
 getUser(){
    try {
       AsyncStorage.getItem('user').
       then(res=>{
        if(res){
          this.setState({
            initialRouteName:'Home'
          })
        }else{
          this.setState({
            initialRouteName:'Login'
          })
        }
       }).catch(error=>{
         console.log(error)
       })
     
    } catch (error) {
      console.log(error)
    }
  }
  componentDidMount(){
    this.getUser()
    
  }
  render() {
    const TabParents=Tab(this.state.initialRouteName)
    return (
      <Root>
        <TabParents/>
      </Root>
    );
  }
}
export default StackTab;

// export default createAppContainer(createStackNavigator(
//   {
//     Home: Home,
//     Detail: Detail,
//     Login: Login
//   },
//   {
//     initialRouteName: 'Login',
//     headerMode: "none"
//   }
// ))