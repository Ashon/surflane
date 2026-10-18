// Framework-neutral: callers synchronously commit DOM + framework state together.
let active;
let revision = 0;
export function transitionTheme(update) {
  const request = ++revision;
  active?.skipTransition();
  const root = document.documentElement;
  root.dataset.themeSwitching = "";
  const apply = () => {
    if (request === revision) update();
  };
  const clear = () => {
    if (request !== revision) return;
    active = undefined;
    delete root.dataset.themeSwitching;
  };
  if (
    !document.startViewTransition ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    try {
      apply();
    } catch (error) {
      clear();
      throw error;
    }
    // Keep component CSS transitions suppressed until the new styles have painted.
    return new Promise((resolve) =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          clear();
          resolve();
        }),
      ),
    );
  }
  try {
    const transition = document.startViewTransition(apply);
    active = transition;
    void transition.ready.catch(() => {});
    return transition.finished.catch(() => {}).finally(clear);
  } catch (error) {
    clear();
    throw error;
  }
}
