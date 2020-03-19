import React from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, FlatList, ScrollView, Alert } from 'react-native';
import {AntDesign} from '@expo/vector-icons';

export default class MyShopEmptyPage extends React.Component {
    render() {
      const {btnCreateShop} = this.props;
        return (
          <View style={this.styles.container}>
            <View style={this.styles.view1}>
              <Text style={this.styles.text1}>สร้างร้านค้าใหม่</Text>
              <TouchableOpacity style={this.styles.btn1} onPress={btnCreateShop}>
                <AntDesign color='white' name='plus' size={50}/>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
}
const styles = StyleSheet.create({
  container : {
    flex: 0.94,
    backgroundColor:'#151A20'
  },
  view1 : {
    flex:1,
    marginLeft:15,
    marginRight:15,
    alignItems:'center',
    justifyContent:'center'
  },
  text1 : {
    color:'#8A8A8F',
    fontSize:18,
    fontFamily:'kanitBold'
  },
  btn1 : {
    width:70,
    height:70,
    right:20,
    bottom:30,
    borderRadius:100,
    position:'absolute',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#FF2D55'
  }
});
