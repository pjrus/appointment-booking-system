// Client-side wrapper around the next-themes ThemeProvider.
// Enables dark/light mode toggling across the application by passing
// the theme attribute as a CSS class to the <html> element.
'use client';


import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
