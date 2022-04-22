import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, Text, View, FlatList, SafeAreaView, LogBox, Image } from 'react-native';
import firebase from 'firebase/compat/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { Provider as PaperProvider, Card, List, Button } from 'react-native-paper';
import Constants from 'expo-constants';
import LoginScreen from './Login';

const firebaseConfig = {
  apiKey: "AIzaSyBoiiGL1Mil0R5Nvu9Gy71-npJTZAy7Y6o",
  authDomain: "finalporject-92e39.firebaseapp.com",
  databaseURL: "https://finalporject-92e39-default-rtdb.firebaseio.com",
  projectId: "finalporject-92e39",
  storageBucket: "finalporject-92e39.appspot.com",
  messagingSenderId: "1095084252125",
  appId: "1:1095084252125:web:d4941d63aa8cf263a5f434",
  measurementId: "G-154BK1LD91"
};

LogBox.ignoreAllLogs(true);

try {
  firebase.initializeApp(firebaseConfig);
} catch (err) { }

function dbListener(path, setData) {
  const tb = ref(getDatabase(), path);
  onValue(tb, (snapshot) => {
    setData(snapshot.val());
  })
}

function renderCN(item, index, setItem) {
  var icon = <Image style={{ width: 30, height: 20 }} source={{ uri: `https://media.discordapp.net/attachments/963335340301639680/965192107709071370/Pngtreesnow_mountain_hills_natural_island_4979196.png?width=427&height=427` }} />
  var desc = <View>
    <Text>{"เบอร์โทร : " + item.tel}</Text>
    <Text>{"Email : " + item.email}</Text>
  </View>;
  return <List.Item onPress={() => setItem(item)} title={item.nameth} description={desc} left={(props => icon)}></List.Item>
}

function Detail(props) {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <ScrollView>
          <Card>
          <Card.Cover source={{uri:(`${props.item.cover}`)}}/>
            <Card.Title title="ข้อมูลเพิ่มเติม" />
            <Card.Content>
              <Text style={{fontSize:18,fontWeight:'bold'}} >{props.item.nameth}</Text>
              <Text>สถานที่ติดต่อ : {props.item.address}</Text>
              <Text>เบอร์โทร : {props.item.tel}</Text>
              <Text>Email : {props.item.email}</Text>
              <Text>สถานที่เด่นๆ : {props.item.landmark}</Text>
              <Text style={{fontWeight:'bold',color:'#006400'}}>ค่าเข้าชมของคนไทย เด็ก  {props.item.pricechildth} บาท  ผู้ใหญ่ {props.item.pricechildth} บาท </Text>
              <Text style={{fontWeight:'bold',color:'#8B4513',marginBottom:20}}>ค่าเข้าชมของชาวต่างชาติ เด็ก {props.item.pricechildfr} บาท ผู้ใหญ่ {props.item.pricechildfr} บาท</Text>
              <Image style={{ width: 380, height: 550 }} source={{uri:(`${props.item.pic}`)}} />
              <Button style={{ marginTop: 100, backgroundColor: '#3700ff' }} onPress={() => props.setItem(null)}>
                <Text style={{ color: '#ffff' }}>Back</Text>
              </Button>
            </Card.Content>

          </Card>
        </ScrollView>
      </View>
    </PaperProvider>
  );
};


function Loading() {
  return <View><Text>Loading</Text></View>
}


export default function App() {
  const [chmnationalpark, setchmnationalpark] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [citem, setCitem] = React.useState(null);

  React.useEffect(() => {
    var auth = getAuth();
    auth.onAuthStateChanged(function (us) {
      setUser(us);
    });
    dbListener("/chmnationalpark", setchmnationalpark);
  }, []);

  if (user == null) {
    return <LoginScreen />;
  }
  if (chmnationalpark.length == 0) {
    return <Loading />;
  }
  if (citem != null) {
    return <Detail item={citem} setItem={setCitem} />;
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <ScrollView>
          <Card>
            <Card.Cover source={{ uri: ("https://media.discordapp.net/attachments/963335340301639680/965189950196822046/1fefb53269719e74.png?width=815&height=427") }} />
            <Card.Title title="อุทยานแห่งชาติในจังหวัดเชียงใหม่" />
            <Card.Content>
              <Text>Your Phone Number: {user.phoneNumber}</Text>
              <FlatList data={chmnationalpark}
                renderItem={({ item, index }) => renderCN(item, index, setCitem)} >
              </FlatList>
            </Card.Content>
          </Card>
        </ScrollView>
        <Button icon="logout" mode="contained" onPress={() => getAuth().signOut()}>
          Sign Out
        </Button>
        <StatusBar backgroundColor="rgba(0,0,0,0.5)" style="light" />
      </View>
    </PaperProvider>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
  Text:{
    
  },
});
