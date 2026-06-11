const MIN_FOCUS_RATIO = 0.52;
const instances = new Set();

export function registerProjectVideo(instance) {
  instances.add(instance);
  syncProjectVideos();

  return () => {
    instance.pause();
    instances.delete(instance);
    syncProjectVideos();
  };
}

export function updateProjectVideoRatio(instance, ratio) {
  instance.ratio = ratio;
  syncProjectVideos();
}

export function markProjectVideoComplete(instance) {
  instance.completed = true;
  instance.pause();
  syncProjectVideos();
}

function pickFocusedInstance() {
  let focused = null;
  let bestRatio = MIN_FOCUS_RATIO;

  for (const instance of instances) {
    if (instance.completed || instance.ratio < MIN_FOCUS_RATIO) continue;
    if (instance.ratio > bestRatio) {
      bestRatio = instance.ratio;
      focused = instance;
    }
  }

  return focused;
}

export function syncProjectVideos() {
  const focused = pickFocusedInstance();

  for (const instance of instances) {
    if (instance === focused) {
      instance.play();
    } else {
      instance.pause();
    }
  }
}
