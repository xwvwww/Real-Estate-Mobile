import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AppBackgroundGlow() {
  return (
    <LinearGradient
      colors={['rgba(120,170,255,0)', 'rgba(120,170,255,0.35)', 'rgba(120,170,255,0)']}
      locations={[0, 0.5, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.glow}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    width: '180%',
    height: 380,
    borderRadius: 380,
    left: '-40%',
    bottom: -260,
    opacity: 0.9,
    zIndex: -1,
  },
});
