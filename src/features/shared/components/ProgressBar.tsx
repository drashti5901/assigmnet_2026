import React from 'react';
import {View} from 'react-native';
import {screenStyles} from '../styles/screenStyles';

type ProgressBarProps = {
  progress: number;
};

export function ProgressBar({progress}: ProgressBarProps) {
  return (
    <View
      accessibilityLabel={`Course progress ${progress}%`}
      accessibilityRole="progressbar"
      accessibilityValue={{min: 0, max: 100, now: progress}}
      style={screenStyles.progressTrack}>
      <View style={[screenStyles.progressFill, {width: `${progress}%`}]} />
    </View>
  );
}
