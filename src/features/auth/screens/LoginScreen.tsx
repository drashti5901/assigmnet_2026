import React from 'react';
import {ActivityIndicator, ScrollView, Text, TextInput, View} from 'react-native';
import {ActionButton} from '../../shared/components/ActionButton';
import {screenStyles} from '../../shared/styles/screenStyles';

type LoginScreenProps = {
  email: string;
  password: string;
  loginError: string;
  loginLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin: () => void;
};

export function LoginScreen({
  email,
  password,
  loginError,
  loginLoading,
  onEmailChange,
  onPasswordChange,
  onLogin,
}: LoginScreenProps) {
  return (
    <ScrollView contentContainerStyle={screenStyles.loginPage} keyboardShouldPersistTaps="handled">
      <View style={screenStyles.brandMark}><Text style={screenStyles.brandMarkText}>L</Text></View>
      <Text style={screenStyles.eyebrow}>YOUR LEARNING SPACE</Text>
      <Text style={screenStyles.loginTitle}>A little progress{'\n'}goes a long way.</Text>
      <Text style={screenStyles.subtitle}>Sign in to pick up where you left off.</Text>
      <View style={screenStyles.loginCard}>
        <Text style={screenStyles.fieldLabel}>EMAIL</Text>
        <TextInput
          accessibilityLabel="Email"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onChangeText={onEmailChange}
          placeholder="you@example.com"
          placeholderTextColor="#A0A7A2"
          style={screenStyles.input}
          value={email}
        />
        <Text style={screenStyles.fieldLabel}>PASSWORD</Text>
        <TextInput
          accessibilityLabel="Password"
          onChangeText={onPasswordChange}
          placeholder="At least 6 characters"
          placeholderTextColor="#A0A7A2"
          secureTextEntry
          style={screenStyles.input}
          value={password}
        />
        {!!loginError && <Text style={screenStyles.errorText}>{loginError}</Text>}
        <ActionButton disabled={loginLoading} onPress={onLogin} title="Sign in">
          {loginLoading ? <ActivityIndicator color="white" /> : null}
        </ActionButton>
      </View>
      <Text style={screenStyles.demoNote}>Demo login · use any valid email and password (6+ characters)</Text>
    </ScrollView>
  );
}
