import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get("window").width;
const API_KEY = "7f47477887430a60e8689f112c7e7b69";
const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    // * 사용자 위치 정보를 받아올 수 있도록 허가 요청
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) setOk(false);

    // * 유저 위치 정보 받아오기
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 }); // 정확도 설정
    
    // * 받아온 위도, 경도 데이터를 도시명으로 변환
    const location = await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      },
      { useGoogleMaps: false }
    );
    setCity(location[0]);
    console.log(location[0]);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
    // console.log(days);
  }

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.region}>
          {city.region} {city.city}
        </Text>
        <Text style={styles.cityName}>{city.street}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          days.map((day, idx) => (
            <View key={idx} style={styles.day}>
              <Fontisto style={styles.icon} name={icons[day.weather[0].main]} />
              <Text style={styles.temp}>
                {parseFloat(day.temp.day).toFixed(1)}
              </Text>
              <Text style={styles.description} weather={day.weather[0].main}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  region: {
    fontSize: 20,
  },
  cityName: {
    fontSize: 52,
    marginTop: 10,
    fontWeight: "200",
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  weather: {
    backgroundColor: "white",
  },
  temp: {
    fontSize: 100,
    marginTop: 30,
  },
  description: {
    fontSize: 60,
  },
  tinyText: {
    fontSize: 14,
  },
  icon: {
    fontSize: 100,
  },
});