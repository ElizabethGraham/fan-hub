import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// next/image renders as a plain <img> in tests
vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, className }: Record<string, unknown>) =>
    React.createElement('img', { src, alt, width, height, className }),
}));

// next/link renders as a plain <a> in tests
vi.mock('next/link', () => ({
  default: ({ href, children, className, ...rest }: Record<string, unknown>) =>
    React.createElement('a', { href, className, ...rest }, children as React.ReactNode),
}));

// canvas-confetti is a no-op in jsdom (no canvas support)
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

// server-only throws in non-server environments; stub it out for tests
vi.mock('server-only', () => ({}));
