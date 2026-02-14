export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return
  try {
    await navigator.serviceWorker.register('/service-worker.js')
  } catch (err) {
    console.error('SW registration failed', err)
  }
}

export function listenForSyncMessages(onMessage: (msg: MessageEvent) => void) {
  if (!('serviceWorker' in navigator)) return () => {}
  const handler = (event: MessageEvent) => onMessage(event)
  navigator.serviceWorker.addEventListener('message', handler)
  return () => navigator.serviceWorker.removeEventListener('message', handler)
}
