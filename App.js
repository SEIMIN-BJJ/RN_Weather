import React from 'react';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { View, Text, Dimensions, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const API_KEY = 'e8e04ff2b6daa7caef341391331e9e7c';

export default function App() {
    const [city, setCity] = useState('Loading...');
    const [days, setDays] = useState([]);
    const [ok, setOk] = useState(true);

    const getWeather = async () => {
        const granted = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
            setOk(false);
        }
        const {
            coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({ accuracy: 5 });
        const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
        setCity(location[0].city);
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
        );
        const json = await response.json();
        console.log(json);
    };

    useEffect(() => {
        getWeather();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.city}>
                <Text style={styles.cityName}>{city}</Text>
            </View>
            <ScrollView
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.weather}
            >
                {days.length === 0 ? (
                    <View style={styles.day}>
                        <ActivityIndicator color="black" style={{ marginTop: 10 }} size="large" />
                    </View>
                ) : (
                    days.map((day, index) => (
                        <View key={index} style={styles.day}>
                            <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                            <Text style={styles.description}>{day.weather[0].main}</Text>
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
        backgroundColor: 'yellow',
    },
    city: {
        flex: 1.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cityName: {
        fontSize: 58,
        fontWeight: '500',
    },
    weather: {},
    day: {
        width: screenWidth,
        alignItems: 'center',
    },
    temp: {
        marginTop: 50,
        fontWeight: '600',
        fontSize: 178,
    },
    description: {
        marginTop: -30,
        fontSize: 60,
    },
    tinyText: {
        fontSize: 20,
    },
});
