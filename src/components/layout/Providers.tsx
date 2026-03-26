'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '@/context/CartContext';
import { ChatProvider } from '@/context/ChatContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <CartProvider>
            <ChatProvider>
              {children}
              <Toaster
                position="bottom-right"
                gutter={12}
                toastOptions={{
                  duration: 3500,
                  style: {
                    background: '#1A1A2E',
                    color: '#F5F5F0',
                    border: '1px solid rgba(245,245,240,0.1)',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#00FF85',
                      secondary: '#1A1A2E',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#FF3C00',
                      secondary: '#1A1A2E',
                    },
                  },
                }}
              />
            </ChatProvider>
          </CartProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
