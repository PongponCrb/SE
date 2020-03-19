import React from 'react';
import { Text, View, TouchableOpacity, Image, Alert, AsyncStorage, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BackTab from '../Option/BackTab.js'
import database from '../Database/Database.js';
import * as ImagePicker from 'expo-image-picker';
import {Ionicons} from '@expo/vector-icons';
import * as Font from 'expo-font';
import AllStyle from '../Option/AllStyle.js';

export default class ProfileRestaurantPage extends React.Component {

    constructor(props) {
        super(props);
        this.onAsyncRead();
        this.state = {
          imageMemory:'',
          image:'',
          name:'',
          phone:'',
          address:'',
          information:'',
          realuser:'',
          uhaveshop:0
        };
    }

    onAsyncRead=async ()=>{
      var account = await AsyncStorage.getItem('account_IMDEE');
      var stateShop = await AsyncStorage.getItem('stateRestaurant_IMDEE');
      account = JSON.parse(account);
      if(Number(stateShop) == 1){
        var shop = await AsyncStorage.getItem('profileRestaurant_IMDEE');
        shop = JSON.parse(shop);
        this.setState({
          imageMemory:shop.ImageMemory,
          image:shop.Image,
          name:shop.Name,
          phone:shop.Phone,
          address:shop.Address,
          information:shop.Information,
          uhaveshop:1
        });
      }
      else{
        this.setState({uhaveshop:0});
      }

      this.setState({realuser:account.Email+':'+account.Phone})
      database.readOneDataOnceTime(account.Email+':'+account.Phone, "Restaurant", this.updateAccount);
    }
    onPressNext() {
      if(this.state.name.length < 5){
        Alert.alert('ชื่อร้านสั้นเกินไป');
      }
      else if(this.state.address.length < 30){
        Alert.alert('ที่อยู่สั้นเกินไป');
      }
      else if(this.state.information.length < 5){
        Alert.alert('ข้อมูลร้านสั้นเกินไป');
      }
      else if(this.state.image==''){
        Alert.alert('โปรดใส่รูปโปรไฟล์ของร้าน');
      }
      else if(this.state.phone.length < 9){
        Alert.alert('รูปแบบเบอร์โทรไม่ถูกต้อง');
      }
      else{
        if((this.state.phone.length == 9 && this.state.phone[0] == '0' && this.state.phone[1] == '2') || (this.state.phone.length == 10 && this.state.phone[0] == '0' && (this.state.phone[1] == '6' || this.state.phone[1] == '8' || this.state.phone[1] == '9' || this.state.phone[1] == '2'))){
          var restaurant = {
            Name:this.state.name,
            Phone:this.state.phone,
            Address:this.state.address,
            Information:this.state.information
          }
          database.saveRestaurant(restaurant, this.state.image, this.state.realuser, this.updateProfile_success);
        }
        else{
          Alert.alert('เบอร์โทรไม่ถูกต้อง');
        }
      }
    }
    onPressBack = () =>{
      this.props.navigation.navigate('HomeScreen');
    }
    _pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,

      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }
    };
    updateProfile_success = () =>{
      Alert.alert('บันทึกข้อมูลสำเร็จ!!')
      this.props.navigation.navigate('HomeScreen');
    }
    render() {
        return (
            <LinearGradient
                colors={['#151A20', '#151A20', '#151A20']}
                style={{ flex: 1 }}>
                <View style={styles.bg}>
                    <TouchableOpacity style={styles.pressBack} onPress={this.onPressBack}>
                      <Ionicons style={{marginLeft:5}} name={'ios-arrow-back'} size={20} color={'#DB3966'}/>
                      <Text style={styles.txtOption}>ตั้งค่า</Text>
                    </TouchableOpacity>
                    <View style={styles.body}>
                      <View style={styles.first}>

                          <TouchableOpacity style={styles.pickImgBtn} onPress={this._pickImage}>
                            {(this.state.image!='')
                              ? <Image source={{ uri: this.state.image }} style={styles.img}></Image>
                              : null
                            }
                          </TouchableOpacity>
                      </View>

                      <View style={styles.firstView}>
                          <View style={styles.secondView}>
                              <Text style={styles.txtRes}>ชื่อร้าน</Text>
                          </View>
                          <View style={styles.thirdView}>
                             <TextInput style={styles.txtInput}
                              maxLength={20}
                              onChangeText={name=>this.setState({name})}
                              value={this.state.name}
                              ></TextInput>
                          </View>

                      </View>

                      <View style={styles.firstView}>
                          <View style={styles.secondView}>
                              <Text style={styles.txtRes}>เบอร์โทร</Text>
                          </View>
                          <View style={styles.thirdView}>
                              <TextInput style={styles.txtInput}
                              maxLength={10}
                              onChangeText={phone=>this.setState({phone})}
                              value={this.state.phone}
                              keyboardType='numeric'
                              ></TextInput>
                          </View>

                      </View>

                      <View style={styles.firstView}>
                          <View style={styles.secondView}>
                              <Text style={styles.txtRes}>ที่อยู่</Text>
                          </View>
                          <View style={styles.thirdView}>
                              <TextInput style={styles.txtInput}
                              maxLength={150}
                              onChangeText={address=>this.setState({address})}
                              value={this.state.address}
                              ></TextInput>
                          </View>

                      </View>

                      <View style={styles.firstView}>
                          <View style={styles.secondView}>
                              <Text style={styles.txtRes}>ข้อมูลทั่วไป</Text>
                          </View>
                          <View style={styles.thirdView}>
                              <TextInput style={styles.txtInput}
                              value={this.state.information}
                              maxLength={30}
                              autoCapitalize="null"
                              onChangeText={information=>this.setState({information})}
                              ></TextInput>
                          </View>

                      </View>

                      <View style={styles.forth}>
                          <TouchableOpacity style={styles.fifth}
                              onPress={() => this.onPressNext()}>
                              <View style={styles.seventh}>
                                  <Text style={styles.eight}>บันทึก</Text>
                              </View>
                          </TouchableOpacity>
                      </View>
                  </View>
                  <View style={AllStyle.tailer}/>
                </View>
            </LinearGradient>
        );
    }
}
const styles = StyleSheet.create({
  bg:{
      flex: 1,
      alignContent: 'center',
      flexDirection: 'column',
  },
  pressBack:{
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    padding:15,
    marginTop:10,
    paddingBottom:0
  },
  txtOption:{
    marginLeft:5,
    fontSize:15,
    color:'#DB3966',
    fontFamily:'kanitRegular'
  },
  body:{
    flex:0.98,
    marginLeft:15,
    marginRight:15
  },
  first:{
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '15%',
      marginBottom: '5%',
  },
  pickImgBtn:{
      backgroundColor: '#FF2D55',
      borderRadius: 156 / 2,
      width: 156,
      height: 156,
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row'
  },
  img:{
    width: '100%',
    height:'100%',
    borderRadius:100
  },
  firstView:{
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '5%',
      borderBottomWidth: 1,
      borderBottomColor: '#31343D',
      flex: 1,
  },
  secondView:{
      flexDirection: 'column',
      alignContent: 'flex-start',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flex: 0.3,
  },
  txtRes:{
      fontSize: 16,
      color: '#848484',
      textAlign: 'left',
      marginBottom: '2%',
      fontFamily:'kanitRegular'
  },
  thirdView:{
      flexDirection: 'column',
      alignContent: 'flex-start',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      flex: 1,
  },
  txtInput:{
    fontSize: 16,
    color: '#E4E4E4',
    fontFamily:'kanitRegular',
    textAlign: 'left',
    marginBottom: '2%',
  },
  forth:{
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '20%',
      marginBottom: '5%',
      marginRight: '5%',
      marginLeft: '5%',
      flex: 1,
  },
  fifth:{
      backgroundColor: '#FF2D55',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      width: '75%',
      height: 37,
  },
  seventh:{
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
  },
  eigth:{
      fontSize: 17,
      color: '#FFFFFF',
      fontFamily:'kanitMedium',
      textAlign: 'left',
      marginBottom: '2%',
  },
});
