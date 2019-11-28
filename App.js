import React, { useState, useEffect } from 'react';
import { Text, View, PermissionsAndroid, FlatList, TouchableHighlight } from 'react-native';
import wifi from 'react-native-android-wifi';

const App = () => {
  const [wifiList, setWifiList] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    handlePermissionsAndroid();

    return () => null;
  }, []);

  useEffect(() => {
    if (permissionGranted) {
      handleGetWifiList();
    }

    return () => null;
  }, [permissionGranted]);

  const handlePermissionsAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        'title': 'Wifi networks',
        'message': 'We need your permission in order to find wifi networks'
      });

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermissionGranted(true);
      } else {
        console.log("You will not able to retrieve wifi available networks list");
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const handleGetWifiList = () => {
    wifi.loadWifiList((wifiStringList) => {
      const wifiArray = JSON.parse(wifiStringList);
      setWifiList(wifiArray);
    }, (error) => {
        console.log(error);
      }
    );
  }

  return (
    <View style={[styles.view, { paddingBottom: 20 }]}>
      <Text style={styles.textTitle}>ABP - Comunicação de dados</Text>

      <TouchableHighlight style={styles.buttonPermission} disabled={permissionGranted} onPress={handlePermissionsAndroid}>
        <Text style={styles.textPermission}>Permissão</Text>
      </TouchableHighlight>


      <View>
        {((wifiList) && (wifiList.length > 0)) ? (
          <FlatList
            style={styles.flatList}
            contentContainerStyle={styles.contentContainerStyle}
            data={wifiList.sort((a, b) => b.level - a.level)}
            renderItem={({ item, index }) => (
              <View style={styles.item}>
                <Text style={styles.view}>{item['SSID']}</Text>
                <Text>Level: {item.level}</Text>
              </View>
            )}
            keyExtractor={(item, index) => `${item['SSID']}-${index}`}
          />
        ) : ((permissionGranted) ? (
          <Text>Carregando Lista</Text>
        ) : (
          <Text>Sem permissão</Text>
        ))}
      </View>
    </View>
  );
}

const styles = {
  view: {
    flex: 1,
  },
  textTitle: {
    flex: 0,
    textAlign: 'center',
    backgroundColor: 'red',
  },
  buttonPermission: {
    backgroundColor: 'lightblue',
    padding: 10,
    width: '50%',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center'
  },
  textPermission: {
    textAlign: 'center',
    alignSelf: 'center'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: 'lightgrey',
    padding: 5,
    paddingHorizontal: 15,
  },
  flatList: {
  },
  contentContainerStyle: {
    paddingBottom: 250,
  }
}

export default App;
