import zip from 'jszip'

async function handleNavigationRequest(ev: FetchEvent): Promise<Response> {
  try {
    const res = await fetch(ev.request)
    return res
  } catch (err) {
    return Response.redirect('/rescue/')
  }
}

async function handleApiRequest(ev: FetchEvent): Promise<Response> {
  const path = new URL(ev.request.url).pathname.replace(/^\/\.rescue\/api\//, '').replace(/\/$/, '')
  try {
    switch (`${ev.request.method}:${path}`) {
      case 'POST:update':
        const { version, url } = await ev.request.json()
        const cache = await caches.open('rescue-v1')
        const cached = await cache.match('rescue.zip')
        if (!cached || cached.headers.get('x-rescue-version') !== version) {
          const raw = await fetch(url)
          const headers = new Headers(raw.headers)
          headers.set('x-rescue-version', version)
          const resp = new Response(raw.body, { headers })
          await cache.put('rescue.zip', resp)
          return Response.json({ replaced: cached?.headers.get('x-rescue-version') ?? '' })
        }
        return Response.json({ replaced: false })
      default:
        return Response.json({ error: 'Unknown API call' }, { status: 404 })
    }
  } catch (err) {
    return Response.json({ error: `${err}` }, { status: 500 })
  }
}

async function handleRescueRequest(ev: FetchEvent): Promise<Response> {
  try {
    const cache = await caches.open('rescue-v1')
    const res = await cache.match('rescue.zip')
    if (!res) {
      return new Response('No cached rescue page', { status: 200 })
    }
    const path = new URL(ev.request.url).pathname.replace(/^\/rescue\//, '').replace(/\/$/, '')
    const zipFile = await res.blob()
    const zipData = await zip.loadAsync(zipFile)
    const file =
      zipData.file(path) ?? zipData.file(`${path}/index.html`) ?? zipData.file(`index.html`)
    if (!file) {
      return Response.json({ error: 'File not found!' }, { status: 404 })
    }
    const content = await file.async('blob')
    const headers = new Headers()
    // headers.set('Content-Type', file.name.endsWith('.html') ? 'text/html' : 'text/plain')
    return new Response(content, { status: 200, headers })
  } catch (err) {
    return Response.json({ error: `${err}` }, { status: 500 })
  }
}

function initialize(self: ServiceWorkerGlobalScope) {
  self.addEventListener('install', (ev) => {
    self.skipWaiting()
  })

  self.addEventListener('fetch', (ev) => {
    let resp: Promise<Response>
    if (new URL(ev.request.url).pathname.startsWith('/rescue')) {
      resp = handleRescueRequest(ev)
    } else if (ev.request.mode === 'navigate') {
      resp = handleNavigationRequest(ev)
    } else if (new URL(ev.request.url).pathname.startsWith('/.rescue/api')) {
      resp = handleApiRequest(ev)
    } else {
      resp = fetch(ev.request)
    }
    ev.respondWith(resp)
  })

  console.log(
    '%c%s',
    'font-size: 1rem; background: #2980b9; color: #ecf0f1;',
    'Rescue Service worker initialized'
  )
}

initialize(self as unknown as ServiceWorkerGlobalScope)
