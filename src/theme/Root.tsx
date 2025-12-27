import React from 'react';
import ChatBot from '@site/src/components/Chatbot';

// This wrapper surrounds the entire site
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ChatBot />
    </>
  );
}