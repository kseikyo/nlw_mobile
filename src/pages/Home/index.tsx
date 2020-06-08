import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { StyleSheet, ImageBackground, Text, View, Image } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import RNPickerSelect from 'react-native-picker-select';

import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECITYResponse {
  nome: string;
}

import { useNavigation } from '@react-navigation/native'
const Home = () => {

  const placeholderUF = {
    label: 'Selecione a uf',
    value: '0'
  };
  const placeholderCity = {
    label: 'Selecione a cidade',
    value: '0'
  };

  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUf, setselectedUf] = useState<string>('0');
  const [selectedCity, setselectedCity] = useState<string>('0');

  const navigation = useNavigation();

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      selectedUf,
      selectedCity
    });
  }

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
      const ufInitials = res.data.map(uf => uf.sigla);
      setUfs(ufInitials);
    })
  }, []);

  useEffect(() => {
    if (selectedUf === '0') return;

    axios
      .get<IBGECITYResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(res => {
        const cityNames = res.data.map(city => city.nome);
        setCities(cityNames);
      })
  }, [selectedUf]);

  function handleSelectUf(value: string) {
    setselectedUf(value);
    setselectedCity('0');
  }

  function handleSelectCity(value: string) {
    setselectedCity(value);
  }

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marktplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>

      <View style={styles.footer}>
        <RNPickerSelect
          style={SelectedPickerStyles}
          value={selectedUf}
          placeholder={placeholderUF}
          onValueChange={(value: string, index: number) => { handleSelectUf(value) }}
          items={
            ufs.map(uf => {
              return { label: uf, value: uf, key: uf}
            })
          }
        />
        <RNPickerSelect
          style={SelectedPickerStyles}
          value={selectedCity}
          placeholder={placeholderCity}
          onValueChange={(value: string, index: number) => { handleSelectCity(value) }}
          items={cities === [] ? [{label: 'Selecione a cidade', value: '0'}] : 
          cities.map(city => {
            return { label: city, value: city, key: city }
          })}
        />

        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" color="#fff" size={24} />
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  )
};

export default Home;

const SelectedPickerStyles = StyleSheet.create({
  viewContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  inputIOS: {
    fontSize: 16
  },
  inputAndroid: {
    fontSize: 16,
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,

  },
  
  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});