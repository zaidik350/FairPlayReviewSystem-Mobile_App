/**
 * FormContainer — ScreenContainer pre-configured for form screens:
 *   gradient + keyboard avoiding + scroll + standard padding.
 */

import React from 'react';
import { type ViewStyle } from 'react-native';
import ScreenContainer from './ScreenContainer';

interface FormContainerProps {
  children: React.ReactNode;
  contentStyle?: ViewStyle;
  paddingTop?: number;
  paddingBottom?: number;
}

export default function FormContainer({
  children,
  contentStyle,
  paddingTop = 40,
  paddingBottom = 20,
}: FormContainerProps) {
  return (
    <ScreenContainer keyboard scroll paddingTop={paddingTop} paddingBottom={paddingBottom} contentStyle={contentStyle}>
      {children}
    </ScreenContainer>
  );
}
