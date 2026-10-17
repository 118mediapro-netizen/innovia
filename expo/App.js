// Inovia — appli de test pour Expo Go
// Affiche la version web d'Inovia en plein écran et branche les vraies vibrations de l'iPhone.
import React, { useEffect, useRef } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Haptics from 'expo-haptics';

const URL = 'https://118mediapro-netizen.github.io/innovia/';

// Sons : mêmes fichiers que la version web, joués par l'iPhone (même en mode silencieux).
// Chargés avec précaution : si le module audio manque, l'appli marche quand même, sans son.
let ExpoAudio = null;
try { ExpoAudio = require('expo-audio'); } catch (e) { ExpoAudio = null; }

const PRELOAD = ['pop', 'whoosh', 'level', 'tap', 'click', 'combo', 'pluck', 'coin', 'cash', 'success', 'error', 'alert', 'spark', 'alarm'];
const COPIES = { tap: 4, click: 8, pluck: 6, coin: 6, spark: 3 };
const pool = {};
const next = {};

function makePlayers(name) {
  if (!ExpoAudio || pool[name]) return;
  pool[name] = [];
  next[name] = 0;
  const n = COPIES[name] || 2;
  for (let i = 0; i < n; i++) {
    try {
      const p = ExpoAudio.createAudioPlayer({ uri: URL + 'sfx/' + name + '.wav' });
      try { p.shouldCorrectPitch = false; } catch (e) {}
      pool[name].push(p);
    } catch (e) {}
  }
}

async function loadSounds() {
  if (!ExpoAudio) return false;
  try { await ExpoAudio.setAudioModeAsync({ playsInSilentMode: true }); } catch (e) {}
  PRELOAD.forEach(makePlayers);
  return Object.values(pool).some((l) => l.length > 0);
}

// Un son inconnu (ajouté plus tard dans l'appli) se charge tout seul au premier usage.
function play(name, rate) {
  if (!/^[a-z0-9]+$/.test(String(name))) return;
  makePlayers(name);
  const list = pool[name];
  if (!list || !list.length) return;
  const p = list[next[name] % list.length];
  next[name] += 1;
  try {
    const r = Math.max(0.5, Math.min(3, Number(rate) || 1));
    try { p.setPlaybackRate(r); } catch (e) {}
    const go = () => { try { p.play(); } catch (e) {} };
    const sk = p.seekTo(0);
    if (sk && sk.then) sk.then(go, go); else go();
  } catch (e) {}
}

function unloadSounds() {
  Object.values(pool).forEach((l) => l.forEach((p) => { try { p.remove(); } catch (e) {} }));
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
  const soundOk = useRef(false);
  // Dit à la page que l'iPhone joue les sons lui-même (sinon la page les joue elle-même).
  const announce = () => {
    if (!web.current) return;
    if (soundOk.current) web.current.injectJavaScript('window.__nativeSound = true; true;');
  };
  useEffect(() => {
    loadSounds().then((ok) => { soundOk.current = !!ok; announce(); }).catch(() => {});
    return unloadSounds;
  }, []);
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <WebView
        ref={web}
        source={{ uri: URL }}
        style={styles.web}
        injectedJavaScriptBeforeContentLoaded={BRIDGE}
        onLoadEnd={announce}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  web: { flex: 1, backgroundColor: '#FFFFFF' },
});
