import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Font from 'expo-font';
import Navigator from './src/Navigator';
import Agenda from './src/screens/Agenda';

export default class App extends Component {

  state = {
    fontLoaded: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      'lato': require('./assets/fonts/Lato.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

  render() {

    return (

      <Agenda />

      /*
      <View style={styles.container}>
        {
          this.state.fontLoaded ? (
            <Text style={styles.frase}>My App!</Text>
          ) : null
        }
      </View>
      */

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frase: {
    fontFamily: 'lato',
  }
});