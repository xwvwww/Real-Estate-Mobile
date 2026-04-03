import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { useAuth } from '@/contexts/AuthContext';
import { getDashboardRoute } from '@/lib/auth';

const INTRO_DURATION_MS = 1800;

export default function Index() {
  const { isHydrated, session } = useAuth();
  const [introFinished, setIntroFinished] = useState(false);
  const logoProgress = useSharedValue(0);
  const wordmarkProgress = useSharedValue(0);

  useEffect(() => {
    logoProgress.value = withTiming(1, {
      duration: 820,
      easing: Easing.out(Easing.cubic),
    });

    wordmarkProgress.value = withDelay(
      280,
      withTiming(1, {
        duration: 720,
        easing: Easing.out(Easing.cubic),
      })
    );

    const timer = setTimeout(() => {
      setIntroFinished(true);
    }, INTRO_DURATION_MS);

    return () => clearTimeout(timer);
  }, [logoProgress, wordmarkProgress]);

  if (!isHydrated || !introFinished) {
    return <LaunchIntro logoProgress={logoProgress} wordmarkProgress={wordmarkProgress} />;
  }

  const roleName = session?.user?.role?.name;

  return <Redirect href={roleName ? getDashboardRoute(roleName) : '/login'} />;
}

function LaunchIntro({
  logoProgress,
  wordmarkProgress,
}: {
  logoProgress: Animated.SharedValue<number>;
  wordmarkProgress: Animated.SharedValue<number>;
}) {
  const logoStyle = useAnimatedStyle(() => ({
    opacity: interpolate(logoProgress.value, [0, 1], [0, 1]),
    transform: [
      { scale: interpolate(logoProgress.value, [0, 1], [0.82, 1]) },
      { translateY: interpolate(logoProgress.value, [0, 1], [26, 0]) },
    ],
  }));

  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: interpolate(wordmarkProgress.value, [0, 1], [0, 1]),
    transform: [
      { translateY: interpolate(wordmarkProgress.value, [0, 1], [18, 0]) },
    ],
  }));

  const haloStyle = useAnimatedStyle(() => ({
    opacity: interpolate(logoProgress.value, [0, 1], [0, 0.42]),
    transform: [{ scale: interpolate(logoProgress.value, [0, 1], [0.75, 1.08]) }],
  }));

  return (
    <Animated.View style={styles.safe} entering={FadeIn.duration(300)} exiting={FadeOut.duration(260)}>
      <LinearGradient colors={['#03060F', '#0A1228', '#111C39']} style={StyleSheet.absoluteFill} />

      <View style={styles.orbTop} />
      <View style={styles.orbBottom} />

      <View style={styles.centerWrap}>
        <Animated.View style={[styles.logoHalo, haloStyle]} />

        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <View style={styles.logoClipWrap}>
            <Image
              source={require('@/assets/images/qonys-logo.png')}
              style={styles.logo}
              contentFit="contain"
            />
          </View>

        </Animated.View>

        <Animated.View style={[styles.wordmarkWrap, wordmarkStyle]}>
          <Text style={styles.caption}>платформа недвижимости</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#050915',
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoWrap: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoClipWrap: {
    width: 240,
    height: 164,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    width: 252,
    height: 252,
    transform: [
      { translateX: 5 },
      { translateY: -30 },
    ],
  },
  logoHalo: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#6E97FF',
    opacity: 0.35,
    shadowColor: '#6E97FF',
    shadowOpacity: 0.45,
    shadowRadius: 44,
    shadowOffset: { width: 0, height: 0 },
  },
  wordmarkWrap: {
    marginTop: 14,
    alignItems: 'center',
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 3.2,
    textTransform: 'uppercase',
    color: 'rgba(222, 232, 255, 0.72)',
  },
  orbTop: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(79, 121, 255, 0.18)',
  },
  orbBottom: {
    position: 'absolute',
    bottom: -140,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(84, 149, 255, 0.12)',
  },
});
