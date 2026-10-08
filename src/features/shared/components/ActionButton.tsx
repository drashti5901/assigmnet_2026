import React from 'react';
import {Pressable, Text} from 'react-native';
import {screenStyles} from '../styles/screenStyles';

type ActionButtonProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  onPress: () => void;
  title: string;
};

export function ActionButton({
  children,
  disabled,
  onPress,
  title,
}: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      accessibilityLabel={title}
      style={({pressed}) => [screenStyles.actionButton, pressed && screenStyles.buttonPressed]}>
      {children ?? <Text style={screenStyles.actionButtonText}>{title}</Text>}
    </Pressable>
  );
}
