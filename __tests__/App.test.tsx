/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('../src/navigation/AppNavigator', () => {
  const ReactMock = require('react');
  const { Text: MockText } = require('react-native');
  return {
    AppNavigator: () =>
      ReactMock.createElement(MockText, null, 'DailyBit'),
  };
});

import App from '../App';

test('renders app shell', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<App />);
  });
  expect(tree!.toJSON()).toBeTruthy();
});
