export async function initializeRescue(workerUrl = '/sw.js') {
  if (!('serviceWorker' in navigator)) throw new Error('Service worker not supported')
  try {
    const registration = await navigator.serviceWorker.register(workerUrl, {
      scope: '/',
      type: 'module'
    })
    if (registration.installing) {
      console.log('Service worker installing')
    } else if (registration.waiting) {
      console.log('Service worker installed')
    } else if (registration.active) {
      console.log('Service worker active')
    }
  } catch (error) {
    console.error(`Registration failed with ${error}`)
  }
}

export async function updateRescue(version: string, url: string): Promise<string | false> {
  const resp = await fetch('/.rescue/api/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ version, url })
  })
  const data = await resp.json()
  return data.replaced
}
