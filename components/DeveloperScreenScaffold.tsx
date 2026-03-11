import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { DeveloperBottomBar, DeveloperTabKey } from '@/components/DeveloperBottomBar';

type Props = {
  title: string;
  subtitle: string;
  activeTab: DeveloperTabKey;
};

export function DeveloperScreenScaffold({ title, subtitle, activeTab }: Props) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Кабинет застройщика</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <Pressable style={styles.logoutButton} onPress={() => router.replace('/login')}>
          <Text style={styles.logoutText}>Выйти</Text>
        </Pressable>
      </View>

      <DeveloperBottomBar active={activeTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    height: 73,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    color: '#3A3A3A',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
    color: '#6F6F6F',
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 24,
    alignSelf: 'center',
    minWidth: 140,
    height: 46,
    borderRadius: 10,
    backgroundColor: '#70A0FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
});
