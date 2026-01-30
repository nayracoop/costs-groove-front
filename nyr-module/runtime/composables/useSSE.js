import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

export const useSSE = (channel) => {
  const { public: pub } = useRuntimeConfig()
  const base = (pub && pub.nyr && pub.nyr.sse && pub.nyr.sse.baseURL) || null
  const url = base ? `${base.replace(/\/$/, '')}/${String(channel).replace(/^\//, '')}` : channel

  const data = ref(null)
  let source
  if (process.client) {
    source = new EventSource(url)
    source.onmessage = (ev) => {
      try { data.value = JSON.parse(ev.data) } catch { data.value = ev.data }
    }
  }
  const close = () => { if (source) source.close() }
  return { data, close }
}