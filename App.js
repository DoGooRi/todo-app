import React from 'react';
import { StyleSheet, Text, View, StatusBar, Dimensions, Platform } from 'react-native';

const { height, width } = Dimensions.get("window")

import { TextInput } from 'react-native-gesture-handler';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0F72DF" />
        <Text style={styles.title}>오늘의 할일</Text>
        <View style={styles.card}>
          <TextInput underlineColorAndroid="transparent" style={styles.input} placeholder={"해야할 일"} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F72DF',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 30,
    marginTop: 60,
    fontWeight: "100",
    marginBottom: 30
    
  },
  card: {
    backgroundColor: '#fff',
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50,50,50)",
        shadowOpacity: 0.5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
  }
});
