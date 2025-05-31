import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from "expo-font";
import "../global.css"; 
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    outfit: require("./../assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("./../assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("./../assets/fonts/Outfit-Bold.ttf"),
  });
  
  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <SafeAreaView className="flex-1 bg-white font-sans">
        <Slot />
        <Toast />
      </SafeAreaView>
    </Provider>
  );
}
