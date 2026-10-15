// Inovia — appli de test pour Expo Go
// Affiche la version web d'Inovia en plein écran et branche les vraies vibrations de l'iPhone.
import React, { useEffect, useRef } from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

const URL = 'https://118mediapro-netizen.github.io/innovia/';

// Sons : mêmes fichiers que la version web, joués par l'iPhone (même en mode silencieux).
const SOUNDS = { tap: 4, coin: 6, cash: 2, success: 2, error: 2 };
const pool = {};
const next = {};

async function loadSounds() {
  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: false, shouldDuckAndroid: true });
  } catch (e) {}
  for (const name of Object.keys(SOUNDS)) {
    pool[name] = [];
    next[name] = 0;
    for (let i = 0; i < SOUNDS[name]; i++) {
      try {
        const { sound } = await Audio.Sound.createAsync({ uri: URL + 'sfx/' + name + '.wav' }, { volume: 1 });
        pool[name].push(sound);
      } catch (e) {}
    }
  }
}

function play(name, rate) {
  const list = pool[name];
  if (!list || !list.length) return;
  const s = list[next[name] % list.length];
  next[name] += 1;
  const r = Math.max(0.5, Math.min(2, Number(rate) || 1));
  s.setRateAsync(r, false).catch(() => {});
  s.replayAsync().catch(() => {});
}

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
  useEffect(() => {
    loadSounds();
    return () => {
      Object.values(pool).forEach((l) => l.forEach((x) => x.unloadAsync().catch(() => {})));
    };
  }, []);
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
            if (m && m.t === 'snd') play(m.n, m.r);
          } catch (err) {}
        }}
        bounces={false}
        scrollEnabled={false}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }}
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
