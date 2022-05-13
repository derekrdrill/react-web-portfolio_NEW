import React from 'react';
import { UseRefExample1 } from './components/UseRefExample1';
import { UseRefExample2 } from './components/UseRefExample2';
import { UseRefExample3 } from './components/UseRefExample3';
import { UseMemoExample } from './components/UseMemoExample';
import { UseCallbackExample } from './components/UseCallbackExample';
import { CustomHookExample1 } from './components/CustomHookExample1';
import { CustomHookExample2 } from './components/CustomHookExample2';

export const Sandbox = () => {
  return (
    <div style={{ padding: 20 }}>
      <CustomHookExample2 />
    </div>
  );
};