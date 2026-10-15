// Inovia — appli de test pour Expo Go
// Affiche la version web d'Inovia en plein écran et branche les vraies vibrations de l'iPhone.
import React, { useRef } from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Haptics from 'expo-haptics';

const URL = 'https://118mediapro-netizen.github.io/innovia/';

// Dans la page, navigator.vibrate n'existe pas sur iPhone : on le remplace
// par un message envoyé à l'appli, qui déclenche le moteur de vibration.
const BRIDGE = `
  (function () {
    function send(p) {
      try { window.ReactNativeWebView.postMessage(JSON.stringify({ t: 'vib', p: p })); } catch (e) {}
      return true;
    }
    try { Object.defineProperty(navigator, 'vibrate', { value: send, configurable: true }); }
    catch (e) { navigator.vibrate = send; }
  })();
  true;
`;

function vibrate(p) {
  if (Array.isArray(p)) {
    const total = p.reduce((a, b) => a + (Number(b) || 0), 0);
    if (total >= 150) return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
  const ms = Number(p) || 0;
  if (ms <= 0) return;
  if (ms < 15) return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  if (ms < 30) return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}

export default function App() {
  const web = useRef(null);
  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <WebView
        ref={web}
        source={{ uri: URL }}
        style={styles.web}
        injectedJavaScriptBeforeContentLoaded={BRIDGE}
        onMessage={(e) => {
          try {
            const m = JSON.parse(e.nativeEvent.data);
            if (m && m.t === 'vib') vibrate(m.p);
          } catch (err) {}
        }}
        bounces={false}
        overScrollMode="never"
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        allowsBackForwardNavigationGestures={false}
        setSupportMultipleWindows={false}
        cacheEnabled={false}
        originWhitelist={['*']}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  web: { flex: 1, backgroundColor: '#FFFFFF' },
});
