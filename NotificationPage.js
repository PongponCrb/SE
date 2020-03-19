import React from 'react';
import { 
  StyleSheet,
  Text, 
  View, 
  FlatList, 
  ScrollView, 
  AsyncStorage 
} from 'react-native';
import BackTab from '../Option/BackTab.js'
import Item from '../Option/Item.js';
import database from '../Database/Database.js'
import AllStyle from '../Option/AllStyle.js';
import Loadmore from '../Option/Loadmore.js';

var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
export default class NotificationPage extends React.Component{
  constructor(props){
    super(props);
    this.onAsyncRead();
    this.state = {
      dataSource : [],
      dataObjShow : [],
      realuser : '',
      i : 0,
      lengthObj : 0,
    }
  }

  changeTime = (times) =>{
    if (Platform.OS === 'ios') {
      var day = times.substring(0,times.indexOf('/'))
      times = times.substring(times.indexOf('/')+1).trim();
      var month = times.substring(0,times.indexOf('/'))
      times = times.substring(times.indexOf('/')+1).trim();
      var year = String(Number(times.substring(0,times.indexOf(' ')))-543)
      times = times.substring(times.indexOf(' ')+1).trim();
      var time = times;
      if(day.length==1)
        day = '0'+day
      if(month.length==1)
        month = '0'+month

      var times2 = new Date().toLocaleString("th-TH", {timeZone: "Asia/Bangkok"});
      var day2 = times2.substring(0,times2.indexOf('/'))
      times2 = times2.substring(times2.indexOf('/')+1).trim();
      var month2 = times2.substring(0,times2.indexOf('/'))
      times2 = times2.substring(times2.indexOf('/')+1).trim();
      var year2 = String(Number(times2.substring(0,times2.indexOf(' ')))-543)
      times2 = times2.substring(times2.indexOf(' ')+1).trim();
      var time2 = times2;
      if(day2.length==1)
        day2 = '0'+day2
      if(month2.length==1)
        month2 = '0'+month2
      
      const ago = new Date(month + '/' + day + '/' + year);
      const now = new Date(month2 + '/' + day2 + '/' + year2);
      const diffTime = Math.abs(now - ago);
      const diffDays = Math.ceil(diffTime/(60*60*24*1000));
      if(diffDays < 2 && diffDays >= 1)
        return time.substring(0,time.length-3) + ', Yesterday'
      else if(diffDays < 1)
        return time.substring(0,time.length-3) + ', Today'
      else
        return time.substring(0,time.length-3) + ', ' + day + '/' + month + '/' + year.substring(2)
    }
    else if (Platform.OS === 'android') {
      var dayText = times.substring(0,times.indexOf(' '))
      times = times.substring(times.indexOf(' ')+1).trim();
      var month = times.substring(0,times.indexOf(' '))
      times = times.substring(times.indexOf(' ')+1).trim();
      var day = times.substring(0,times.indexOf(' '))
      times = times.substring(times.indexOf(' ')+1).trim();
      var time = times.substring(0,times.indexOf(' '))
      times = times.substring(times.indexOf(' ')+1).trim();
      var year = times
      if(day.length==1)
        day = '0'+day
      if(String(Number(months.indexOf(month)+1)).length==1)
        month = '0'+String(Number(months.indexOf(month)+1))

      var times2 = new Date().toLocaleString("th-TH", {timeZone: "Asia/Bangkok"});
      var dayText2 = times2.substring(0,times2.indexOf(' '))
      times2 = times2.substring(times2.indexOf(' ')+1).trim();
      var month2 = times2.substring(0,times2.indexOf(' '))
      times2 = times2.substring(times2.indexOf(' ')+1).trim();
      var day2 = times2.substring(0,times2.indexOf(' '))
      times2 = times2.substring(times2.indexOf(' ')+1).trim();
      var time2 = times2.substring(0,times2.indexOf(' '))
      times2 = times2.substring(times2.indexOf(' ')+1).trim();
      var year2 = times2;
      if(day2.length==1)
        day2 = '0'+day2
      if(String(Number(months.indexOf(month2)+1)).length==1)
        month2 = '0'+String(Number(months.indexOf(month2)+1))

      const ago = new Date(month + '/' + day + '/' + year);
      const now = new Date(month2 + '/' + day2 + '/' + year2);
      const diffTime = Math.abs(now - ago);
      const diffDays = Math.ceil(diffTime/(60*60*24*1000));
      if(diffDays < 2 && diffDays >= 1)
        return time.substring(0,time.length-3) + ', Yesterday'
      else if(diffDays < 1)
        return time.substring(0,time.length-3) + ', Today'
      else
        return time.substring(0,time.length-3) + ', ' + day + '/' + month + '/' + year.substring(2)
    }
  }
  onPressLoadmore = () =>{
    var length = this.state.lengthObj-this.state.i;
    if(length>6)
      length = 6
    const x = this.state.i;
    for(var i=x;i<length+x;i++){
      this.state.dataObjShow.splice(this.state.dataObjShow.length-1 ,0 ,this.state.dataSource[i]);
      this.setState({dataObjShow:this.state.dataObjShow});
    }
    setTimeout(()=>{
      this.setState({i:this.state.i+length})
      if(this.state.i>=this.state.lengthObj){
        this.state.dataObjShow.pop();
        this.setState({dataObjShow:this.state.dataObjShow});
      }
    },20)
  }

  onShortText = (text) =>{
    var str;
    if(text.length > 30)
      str = text.substring(0,30) + '...';
    else
      str = text
    return str
  }

  readNotify_success = (obj) =>{
    this.setState({lengthObj:obj.length,dataSource:obj,dataObjShow:[]});
    if(obj.length<=6)
      this.setState({dataObjShow:obj});
    else{
      this.setState({i:0});
      for(var i=0;i<6;i++){
        this.state.dataObjShow.push(obj[i]);
        this.setState({i:this.state.i+1, dataObjShow:this.state.dataObjShow});
      }
      var data = {
        ID : '',
        Notify : '',
        Mode : 'Loadmore'
      }
      this.state.dataObjShow.push(data);
      this.setState({dataObjShow:this.state.dataObjShow});
    }
  }

  onAsyncRead=async ()=>{
    var account = await AsyncStorage.getItem('account_IMDEE');
    account = JSON.parse(account);

    this.setState({realuser:account.Email+':'+account.Phone})
    database.readAllNotify(account.Email+':'+account.Phone, this.readNotify_success);
  }

  render() {
      const { btnCart, btnMess } = this.props;
      return (
          <View style={AllStyle.container}>
            <View style={AllStyle.header}/>
            <BackTab
              headTitle = 'แจ้งเตือน'
              iconCart = {true}
              iconChat = {true}
              btnCart = {btnCart}
              btnMess = {btnMess}
            />
            <View style={[AllStyle.body,{flex:0.87}]}>
              <FlatList
                data = {this.state.dataObjShow}
                style={{marginTop:5}}
                renderItem = {({item}) =>
                  (item.Mode=='Loadmore' && this.state.i!=this.state.lengthObj)
                  ? <Loadmore func={this.onPressLoadmore}/>
                  : <ScrollView style={styles.scrollViewForm}>
                      <Item
                        contentVisible={false}
                        nameNotify={item.Notify.Title}
                        messageNotify={this.onShortText(item.Notify.Body)}
                        stateNotify={item.Notify.Status}
                        timeNotify={this.changeTime(item.Notify.Date.toDate().toLocaleString('th-TH',{timeZone:'Asia/Bangkok'}))}
                        statusNotify={item.Mode}
                        idNotify={item.ID}
                        realuser={this.state.realuser}
                        children={
                          <View style={styles.bodyForm}>
                            <Text style={styles.txtForm}>{item.Notify.Body}</Text>
                          </View>
                        }
                      />
                    </ScrollView>
                  }
              />
            </View>
          </View>
      );
  }
}

const styles = StyleSheet.create({
  scrollViewForm : {
      alignSelf: 'stretch',
      backgroundColor:'#44464D',
      borderRadius:10,
      marginBottom:15
  },
  bodyForm : {
      width:'100%',
      height:'100%'
  },
  txtForm : {
      color:'#8C8C8C',
      fontSize:15
  }
});
