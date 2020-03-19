import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList, ScrollView, Keyboard, Alert, AsyncStorage } from 'react-native';
import BackTab from '../Option/BackTab.js'
import Modal from 'react-native-modal';
import database from '../Database/Database.js';
import AllStyle from '../Option/AllStyle.js';

var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
var monthTH = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม']
export default class MyCartPage extends React.Component{
    constructor(props){
      super(props);
      this.onAsyncRead()
      var objAll = this.props.navigation.getParam('objAll','No-name');
      var n = 0;
      for(var i=0;i<objAll.order.allMenu.length;i++){
        n += objAll.order.allMenu[i].dataMenu.Value;
      }
      this.state = {
        objAll: objAll,
        time : '',
        restaurantDel: '',
        isModalVisible : false,
        realuser:objAll.realuser,
        numCart : objAll.numCart,
        numOrder : n,
        realuser : '',

        name : '',
        address : '',
        phone : '',
        id_order : String(Math.floor((Math.random() * 10000000) + 1)),
      }
      var times = new Date().toLocaleString("th-TH", {timeZone: "Asia/Bangkok"})
      var dayText = times.substring(0,times.indexOf(' '))
      times = times.substring(times.indexOf(' ')+1).trim();
      var month = times.substring(0,times.indexOf(' '))
      times = times.substring(times.indexOf(' ')+1).trim();
      var day = times.substring(0,times.indexOf(' '))
      times = times.substring(times.indexOf(' ')+1).trim();
      var time = times.substring(0,times.indexOf(' '))
      times = times.substring(times.indexOf(' ')+1).trim();
      var year = times
      this.state.time = day+' '+monthTH[months.indexOf(month)]+' '+year+'  |  '+time.substring(0,time.length-3)
    }
    onPressBack = () =>{
      this.props.navigation.goBack();
    }
    _showModal = (restaurantDel) => {
      this.setState({ isModalVisible: true, restaurantDel:restaurantDel});
    }
    _hideModal = () => {
      this.setState({ isModalVisible: false, restaurantDel:''});
    }
    deleteCart = () =>{
      database.deleteCart(this.state.objAll.realuser, this.state.restaurantDel, this.deleteCart_success);
    }
    deleteCart_success = () =>{
      database.updateNumCart(this.state.realuser, this.state.numCart-this.state.numOrder)
      Alert.alert('ลบตะกร้าสินค้านี้สำเร็จ')
      this._hideModal();
      this.props.navigation.navigate('HomeScreen');
    }
    onAsyncRead=async (items)=>{
      var account = await AsyncStorage.getItem('account_IMDEE');
      account = JSON.parse(account);

      this.setState({realuser:account.Email+':'+account.Phone})
      database.readAddressCart(account.Email+':'+account.Phone, this.readAddressCart_success)
    }
    readAddressCart_success = (obj) =>{
      this.setState({
        address:obj.Information+' อ.'+obj.Amphoe+' ต.'+obj.District+' จ.'+obj.Province+' '+obj.Zipcode,
        phone:obj.Phone,
        name:obj.Name
      })
    }
    onPressConfirm = () =>{
      database.checkMenu(this.state.realuser, this.state.objAll, this.checkMenu_success, this.checkMenu_fail)
    }
    checkMenu_success = () =>{
      var objOrder = {
        Date : this.state.time,
        Address : this.state.address,
        TotalPrice : this.state.objAll.order.totalPrice,
        Process : [0,0,0,0],
        NameRestaurant : this.state.objAll.order.dataRestaurant.Name,
        NameUser : this.state.name,
        Status : 0,
        ID_Bill : this.state.id_order,
        Phone : this.state.phone,
        Time : new Date
      }
      database.checkMoney(this.state.realuser, this.state.objAll.order.idRestaurant, this.state.objAll.order.totalPrice, objOrder, this.state.objAll.order.allMenu, this.checkMoney_success, this.checkMoney_fail)
    }
    checkMenu_fail = () =>{
      database.readCart(this.state.realuser);
      Alert.alert('โปรดทำรายการใหม่')
      this.props.navigation.navigate('HomeScreen');
    }
    checkMoney_success = () =>{
      Alert.alert('สั่งสินค้าสำเร็จแล้ว')
      database.readCart(this.state.realuser);
      this.props.navigation.navigate('HomeScreen');
    }
    checkMoney_fail = () =>{
      Alert.alert('เงินของคุณมีไม่พอ \nโปรดฝากเงินก่อนทำการสั่งซื้อสินค้า')
    }
    render() {
        return (
          <View style={AllStyle.container}>
            <View style={AllStyle.header}/>
            <BackTab
              iconBackLG = {true}
              txtBackLG = {this.state.objAll.order.dataRestaurant.Name}
              btnBack = {this.onPressBack}
            />
            <View style={styles.body}>
              <View style={{flex:0.5}}>
                <FlatList
                  data = {this.state.objAll.order.allMenu}
                  renderItem={({ item }) => (item.dataMenu.State==true)
                                            ? <View style={styles.first}>
                                              <View style={{justifyContent:'center',alignItems:'center'}}>
                                                <Image source={{ uri: item.image }} style={styles.img}/>
                                              </View>
                                              <View style={styles.second}>
                                                <Text style={styles.txtName}>{item.dataMenu.Name}</Text>
                                                <Text style={styles.txtType}>{item.dataMenu.Type}</Text>
                                                <View style={{flex:0.5,flexDirection:'row'}}>
                                                  <View style={styles.third}>
                                                    <Text style={styles.price}>฿ {item.dataMenu.Price}</Text>
                                                  </View>
                                                  <View style={styles.forth}>
                                                    <Text style={styles.value}>x {item.dataMenu.Value}</Text>
                                                  </View>
                                                </View>
                                              </View>
                                            </View>
                                            : null
                             }
                />
              </View>
              <View style={{flex:0.5}}>
                <View style={{flex:0.3,margin:10}}>
                    <Text style={styles.txtTotal}>ราคารวม :   ฿ {this.state.objAll.order.totalPrice}</Text>
                    <Text style={styles.txt}>หมายเลขคำสั่งซื้อ   #{this.state.id_order}</Text>
                    <Text style={styles.txt}>เวลา   {this.state.time}</Text>
                </View>
                <View style={styles.firstView}>
                  <View style={styles.infirstView}>
                    <Text style={styles.txt2}>ที่อยู่</Text>
                  </View>
                  <View style={styles.txtView}>
                    <Text style={styles.txt}>{this.state.address}</Text>
                  </View>
                </View>
                <View style={styles.secondView}>
                  <View style={styles.inSecondView}>
                    <Text style={styles.txt2}>เบอร์โทร</Text>
                  </View>
                  <View style={styles.txtPhoneView}>
                    <Text style={styles.txt}>{this.state.phone}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.secondView}>
              <TouchableOpacity style={styles.confirmBtn} onPress={this.onPressConfirm}>
                {/*<Ionicons style={{color:'white',marginRight:5}} name={'ios-card'} size={23}/>
                <FontAwesome style={{color:'white',marginRight:5}} name={'shopping-cart'} size={23}/>*/}
                <Text style={styles.txtConfirm}>ยืนยันการสั่งซื้อ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.showModalBtn}  onPress={()=>this._showModal(this.state.objAll.order.idRestaurant)}>
                <Text style={styles.txtConfirm}>ลบตะกร้าสินค้า</Text>
              </TouchableOpacity>
            </View>
            <View style={AllStyle.tailer}/>

            <View style={{marginTop: 22,position:'absolute' }}>
              <Modal isVisible={this.state.isModalVisible} style={{backgroundColor: 'transparent',alignItems:'center'}}>
                <TouchableOpacity style={styles.hideMoadlBtn} onPress={this._hideModal}>
                </TouchableOpacity>
                <View style={styles.delView}>
                  <Text style={styles.txtDel}>คุณต้องการที่จะลบมันใช่ไหม</Text>
                  <View style={styles.delBtnView}>
                    <TouchableOpacity style={styles.delBtn} onPress={()=>this.deleteCart()}>
                      <Text style={styles.txtConfirmDel}>ตกลง</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.delBtn} onPress={this._hideModal}>
                      <Text style={styles.txtCancelDel}>ยกเลิก</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
      );}

}
const styles = StyleSheet.create({
  body:{
    flex:0.77,
    marginLeft:15,
    marginRight:15
  },
  first:{
    width:'100%',
    height:130,
    flexDirection:'row',
    margin:10
  },
  second:{
    width:'60%',
    paddingLeft:15,
    paddingRight:15,
    justifyContent:'center'
  },
  img:{
    width: 120,
    height: 120,
    borderRadius:10
  },
  txtName:{
    color:'#BDBDBD',
    fontSize:18,
    fontFamily:'kanitSemiBold'
  },
  txtType:{
    color:'#8A8A8F',
    fontSize:13,
    fontFamily:'kanitRegular'
  },
  third:{
    flex:0.55,
    justifyContent:'center',
    alignItems:'flex-start'
  },
  price:{
    color:'#D7D7D7',
    fontSize:18,
    fontFamily:'kanitBold'
  },
  forth:{
    flex:0.45,
    justifyContent:'center',
    alignItems:'flex-end'
  },
  value:{
    color:'white',
    fontSize:20,
    fontFamily:'kanitMedium'
  },
  txtTotal:{
    color:'white',
    fontSize:18,
    fontFamily:'kanitSemiBold'
  },
  txt:{
    color:'white',
    fontSize:14,
    fontFamily:'kanitRegular'
  },
  txt2:{
    color:'#737373',
    fontSize:16,
    fontFamily:'kanitSemiBold'
  },
  firstView:{
    flex:0.4,
    margin:5,
    borderRadius:10,
    borderColor:'#30353C',
    borderWidth:1
  },
  infirstView:{
    flex:0.4,
    margin:20,
    marginBottom:5,
    marginTop:10,
    justifyContent:'center'
  },
  secondView:{
    flex:0.07,
    flexDirection:'row',
    marginLeft:10,
    marginRight:10
  },
  txtView:{
    flex:0.6,
    margin:20,
    marginTop:0,
    marginBottom:10
  },
  inSecondView:{
    flex:0.5,
    margin:20,
    marginBottom:5,
    marginTop:10,
    justifyContent:'center'
  },
  txtPhoneView:{
    flex:0.5,
    margin:20,
    marginTop:0,
    marginBottom:10
  },
  confirmBtn:{
    flex:0.5,
    flexDirection:'row',
    margin:5,
    marginLeft:10,
    marginRight:5,
    borderRadius:100,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#FF2D55'
  },
  txtConfirm:{
    color:'white',
    fontSize:15,
    fontFamily:'kanitMedium'
  },
  showModalBtn:{
    flex:0.5,
    margin:5,
    marginLeft:5,
    marginRight:10,
    borderRadius:100,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#686868'
  },
  hideMoadlBtn:{
    flex:1,
    width:'100%',
    backgroundColor:'transparent',
    justifyContent:'center'
  },
  delView:{ height:150,
    width:'80%',
    backgroundColor:'#31343D',
    borderRadius:10,
    position:'absolute',
    alignItems:'center'
  },
  txtDel:{
    color:'white',
    fontSize:20,
    ontFamily:'kanitBold',
    padding:10,
    paddingTop:30
  },
  delBtnView:{
    flexDirection:'row',
    width:'100%',
    justifyContent:'center',
    alignItems:'center'
  },
  delBtn:{
    flex:0.5,
    justifyContent:'center',
    alignItems:'center'
  },
  txtConfirmDel:{
    color:'#2BF658',
    fontSize:30,
    fontFamily:'kanitMedium'
  },
  txtCancelDel:{
    color:'#FF2D55',
    fontSize:30,
    fontFamily:'kanitMedium'
  },
});
