import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import PatternView from './components/PatternView';


const { width, height } = Dimensions.get("window");

// const AnimatedG = Animated.createAnimatedComponent(G);

export default function App() {

    return (
        <PatternView
            gridConfig={{ width: width / 20, height: width / 20, color: "#7f7f7f" }}
            maskConfig={{duration: 2000, animate: true}}
            backgroundColor='black'
        >
            <Text style={{color:'white', marginTop: 100}}> Hello</Text>
            <StatusBar style="light" />
        </PatternView>
    );
}

const styles = StyleSheet.create({});
