import React from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import database from '../Database/Database.js';

export default class CreateShopPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          name:'',
          phone:'',
          address:'',
          information:'',
          image:'',
          realuser:'',
          check:false,
          i:0,
        };
    }
    onPressNext = () =>{
      if(this.state.name.length < 5){
        Alert.alert('ชื่อร้านสั้นเกินไป');
      }
      else if(this.state.address.length < 30){
        Alert.alert('ที่อยู่สั้นเกินไป');
      }
      else if(this.state.information.length < 5){
        Alert.alert('ข้อมูลทั่วไปของร้านสั้นเกินไป');
      }
      else if(this.state.image==''){
        Alert.alert('โปรดใส่รูปร้านค้าของคุณ');
      }
      else if(this.state.phone.length < 9){
        Alert.alert('เบอร์โทรไม่ถูกต้อง');
      }
      else{
        if((this.state.phone.length == 9 && this.state.phone[0] == '0' && (this.state.phone[1] == '2' || this.state.phone[1] == '3')) || (this.state.phone.length == 10 && this.state.phone[0] == '0' && (this.state.phone[1] == '6' || this.state.phone[1] == '8' || this.state.phone[1] == '9' || this.state.phone[1] == '2'))){
          var restaurant = {
            Name:this.state.name,
            Phone:this.state.phone,
            Address:this.state.address,
            Information:this.state.information,
            ValueMenu:0
          }
          database.createRestaurant(restaurant, this.state.image, this.state.realuser, this.createRestaurant_success);
        }
        else{
          Alert.alert('เบอร์โทรไม่ถูกต้อง');
        }
      }
    }
    createRestaurant_success = () =>{
      Alert.alert('สร้างร้านค้าสำเร็จ');
      this.setState({check:true});
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
    render() {
      const {btnCreateShop, realuser} = this.props;
      if(this.state.i==0){
          this.setState({realuser:realuser,i:1});
      }
      if(this.state.check==true){
        btnCreateShop();
      }
        return (
            <LinearGradient
                colors={['#151A20', '#151A20', '#151A20']}
                style={{ flex: 0.94 }}>
                <View style={styles.bg}>

                    <View style={styles.viewBody}>
                      <View style={styles.body}>

                          <TouchableOpacity style={styles.pickImgBtn} onPress={this._pickImage}>
                            {(this.state.image!='')?<Image source={{ uri: this.state.image }} style={{ width: '100%', height:'100%', borderRadius:100}}></Image>:null}
                          </TouchableOpacity>
                      </View>

                      <View style={styles.first}>


                      <View style={styles.second}>

                          <View style={styles.third}>

                          <Image
                              style={styles.img}
                              source={require('../image/contact.png')}
                          />

                              <Text style={styles.nameResTxt}>ชื่อร้าน</Text>
                          </View>
                            <TextInput style={styles.txtInput}
                            maxLength={20}
                            onChangeText={name=>this.setState({name})}
                            value={this.state.name}
                            ></TextInput>
                      </View>


                      <View style={styles.second}>
                          <View style={styles.third}>
                              <Image
                                  style={styles.phoneImg}
                                  source={require('../image/phone.png')}
                              />
                              <Text style={styles.txtPhone}>เบอร์โทร</Text>
                          </View>
                            <TextInput style={styles.txtInput}
                            maxLength={10}
                            onChangeText={phone=>this.setState({phone})}
                            value={this.state.phone}
                            keyboardType='numeric'
                            ></TextInput>
                      </View>
                      <View style={styles.second}>
                          <View style={styles.third}>
                              <Image
                                  style={styles.phoneImg}
                                  source={require('../image/map.png')}
                              />
                              <Text style={styles.nameResTxt}>ที่อยู่</Text>
                          </View>
                            <TextInput style={styles.txtInput}
                            maxLength={150}
                            onChangeText={address=>this.setState({address})}
                            value={this.state.address}
                            ></TextInput>
                      </View>

                      <View style={styles.second}>
                          <View style={styles.third}>
                              <Image
                                  style={styles.img}
                                  source={require('../image/information.png')}
                              />
                              <Text style={styles.nameResTxt}>ข้อมูลทั่วไป</Text>
                          </View>
                              <TextInput style={styles.txtInput}
                              onChangeText={information=>this.setState({information})}
                              value={this.state.information}
                              ></TextInput>
                      </View>
                      <View style={{flex:1}}/>
                      </View>

                      <View style={styles.forth}>
                          <TouchableOpacity style={styles.fifth}
                              onPress={this.onPressNext}>
                              <View style={styles.sixth}>
                                  <Text style={styles.txtCreate}>สร้างร้านค้า</Text>
                              </View>
                          </TouchableOpacity>
                      </View>

                  </View>
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
  viewBody:{
    flex:1.2,
    marginLeft:15,
    marginRight:15
  },
  body:{
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '5%',
  },
  pickImgBtn:{
      backgroundColor: '#FF2D55',
      borderRadius: 108 / 2,
      width: 108,
      height: 108,
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderColor:'#C4C4C4',
      borderWidth:5,
  },
  first:{
    flex:1,
    backgroundColor:'#282D34',
    marginBottom:'5%',
    marginTop:'5%',
    borderRadius:10,
  },
  second:{
      flex:1,
      alignContent: 'flex-start',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      marginLeft: '5%',
      marginRight: '5%',
      marginTop: '2%',
  },
  third:{
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop:10,
  },
  forth:{
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf:'center',
      bottom:0,
      marginTop:'5%',
      position:'absolute'
  },
  fifth:{
      backgroundColor: '#FF2D55',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      width: 131,
      height: 37,
  },
  sixth:{
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
  },
  img:{
      width: 20,
      height: 20,
      alignContent: 'flex-start',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      tintColor: '#DADADA',
      marginEnd:'2%'
  },
  nameResTxt:{
      fontSize: 16,
      color: '#FFFFFF',
      fontFamily:'kanitMedium',
      textAlign: 'left',
      marginBottom: '2%',
  },
  txtInput:{
      fontSize: 16,
      color: '#848484',
      fontFamily:'kanitMedium',
      textAlign: 'left',
      marginBottom: '2%',
      width:'100%',
      borderBottomColor:'#585558',
      borderBottomWidth:1
  },

  phoneImg:{
      width: 20,
      height: 20,
      alignContent: 'flex-start',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      tintColor: '#DADADA',
      marginEnd: '2%'
  },
  txtPhone:{
      fontSize: 16,
      color: '#FFFFFF',
      fontFamily:'kanitMedium',
      textAlign: 'left',
      marginBottom: '2%',
  },
  txtCreate:{
      fontSize: 17,
      color: '#FFFFFF',
      fontFamily:'kanitBold',
      textAlign: 'left',
      marginBottom: '2%',
  }
});
