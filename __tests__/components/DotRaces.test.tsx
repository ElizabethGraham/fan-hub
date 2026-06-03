import { act, fireEvent, render, screen } from '@testing-library/react';
import DotRaces from '@/components/DotRaces';

describe('DotRaces', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('moves racers with compositor transforms during animation frames', async () => {
    const rafCallbacks: FrameRequestCallback[] = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      rafCallbacks.push(callback);
      return rafCallbacks.length;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

    render(<DotRaces />);
    fireEvent.click(screen.getByRole('button', { name: /^Red$/ }));

    await act(async () => {
      vi.advanceTimersByTime(2_000);
    });
    await act(async () => {
      vi.advanceTimersByTime(3_000);
    });

    const redRacer = screen.getByTestId('dot-race-racer-red');
    const redFill = screen.getByTestId('dot-race-fill-red');
    expect(redRacer).toHaveStyle({ transform: 'translate3d(4%, 0, 0)' });
    expect(redFill).toHaveStyle({ transform: 'scale3d(0.04, 1, 1)' });

    expect(rafCallbacks.length).toBeGreaterThan(0);
    await act(async () => {
      rafCallbacks[0](performance.now() + 1_000);
    });

    expect(redRacer.style.transform).toMatch(/^translate3d\([0-9.]+%, 0, 0\)$/);
    expect(redRacer.style.transform).not.toBe('translate3d(4%, 0, 0)');
    expect(redFill.style.transform).toMatch(/^scale3d\(0\.[0-9]+, 1, 1\)$/);
  });
});
