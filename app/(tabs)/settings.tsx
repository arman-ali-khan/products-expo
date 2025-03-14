import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, TouchableOpacity } from 'react-native';
import { Lock } from 'lucide-react-native';
import { getPinState, savePin } from '@/app/utils/storage';

export default function Settings() {
  const [isPinEnabled, setIsPinEnabled] = useState(false);
  const [pin, setPin] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPinState();
  }, []);

  async function loadPinState() {
    const pinState = await getPinState();
    setIsPinEnabled(pinState.isSet);
  }

  async function handlePinToggle(value: boolean) {
    if (value) {
      setShowPinInput(true);
    } else {
      await savePin('');
      setIsPinEnabled(false);
      setPin('');
      setShowPinInput(false);
    }
  }

  async function handleSetPin() {
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    await savePin(pin);
    setIsPinEnabled(true);
    setShowPinInput(false);
    setError('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Lock size={24} color="#666" />
          <Text style={styles.sectionTitle}>Security</Text>
        </View>
        
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>PIN Protection</Text>
          <Switch
            value={isPinEnabled}
            onValueChange={handlePinToggle}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isPinEnabled ? '#2196F3' : '#f4f3f4'}
          />
        </View>

        {showPinInput && (
          <View style={styles.pinContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter PIN (min 4 digits)"
              keyboardType="numeric"
              secureTextEntry
              value={pin}
              onChangeText={setPin}
              maxLength={6}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleSetPin}>
              <Text style={styles.buttonText}>Set PIN</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#666',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  pinContainer: {
    marginTop: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});