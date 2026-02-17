declare module 'radio-buttons-react-native' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';

  interface RadioButtonProps {
    data: Array<{ label: string; value: string }>;
    selectedBtn?: (e: { label: string; value: string }) => void;
    initial?: number;
    style?: ViewStyle;
    boxStyle?: ViewStyle;
    [key: string]: any;
  }

  const RadioButtonRN: React.FC<RadioButtonProps>;
  export default RadioButtonRN;
}