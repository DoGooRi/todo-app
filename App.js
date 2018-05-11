import React from 'react';
import { StyleSheet, Text, View, StatusBar, Dimensions, Platform, AsyncStorage } from 'react-native';
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import ToDo from './ToDo';
import { AppLoading } from 'expo';
import uuidv1 from 'uuid';

const { height, width } = Dimensions.get("window")

export default class App extends React.Component {
  state = {
    newToDo: "",
    loadedToDos: false,
    toDos: {}
  }
  componentDidMount = () => {
    this._loadToDos();
  }
  render() {
    const { newToDo, loadedToDos, toDos } = this.state;
    // console.log(toDos)
    if (!loadedToDos) {
      return <AppLoading />
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0F72DF" />
        <Text style={styles.title}>오늘의 할일</Text>
        <View style={styles.card}>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.input}
            placeholder={"해야할 일"}
            value={newToDo}
            onChangeText={this._controlNewToDo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            onSubmitEditing={this._addToDo}
          />
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos).reverse().map(toDo =>
              <ToDo
                key={toDo.id}
                {...toDo} // props 패싱
                deleteToDo={this._deleteToDo}
                uncompleteToDo={this._uncompleteToDo}
                completeToDo={this._completeToDo}
                updateToDo={this._updateToDo}
              />)}
          </ScrollView>
        </View>
      </View>
    );
  }

  _controlNewToDo = text => {
    this.setState({
      newToDo: text
    })
  }

  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      console.log(toDos);
      this.setState({
        loadedToDos: true,
        toDos: JSON.parse(toDos) || {}
      })
    } catch (err) {
      console.log(err)
    }
  }

  _addToDo = () => {
    const { newToDo } = this.state;
    if (newToDo !== "") {
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now()
          }
        }
        const newState = {
          ...prevState,
          newToDo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        }
        this._saveToDos(newState.toDos);
        return { ...newState };
      })
    }
  }

  _deleteToDo = (id) => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    })
  }

  _uncompleteToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState }
    })
  }

  _completeToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: { ...prevState.toDos[id], isCompleted: true }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState }
    });
  };

  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: { ...prevState.toDos[id], text: text }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState }
    });
  };

  _saveToDos = (newToDos) => {
    console.log(JSON.stringify(newToDos));
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
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
    padding: 20,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
    fontSize: 25
  },
  toDos: {
    alignItems: 'center'
  }
});
