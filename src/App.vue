<script setup lang="ts">
import { MoonIcon, SunIcon } from '@heroicons/vue/24/solid'
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'

const form = ref({
  length: 12,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  quantity: 3,
  format: 'json',
  separator: '\n',
  quoted: true,
})

const result = ref('')
const contentType = ref('')
const filename = ref('passwords')
const apiUrl = import.meta.env.VITE_API_URL
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

const generate = async () => {
  try {
    const token = await (window as any).grecaptcha.execute(siteKey, { action: 'generate' })

    const response = await axios.post(`${apiUrl}/password/generate`, {
      ...form.value,
      recaptchaToken: token,
    }, {
      responseType: 'text',
    })

    result.value = response.data
    contentType.value = response.headers['content-type']
  } catch (err) {
    result.value = 'Error: ' + (err as any).message
  }
}

const copyToClipboard = async () => {
  await navigator.clipboard.writeText(result.value)
  alert('Copied to clipboard!')
}

const downloadFile = () => {
  const blob = new Blob([result.value], { type: contentType.value || 'text/plain' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename.value}.${form.value.format}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const isDark = ref<boolean>(false)

const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  isDark.value = saved ? saved === 'dark' : prefersDark
  document.documentElement.classList.toggle('dark', isDark.value)
})
watch(isDark, (val) => {
  localStorage.setItem('theme', val ? 'dark' : 'light')
})
</script>

<template>
  <div class="min-h-screen bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300">
    <div class="max-w-2xl mx-auto px-4 py-8">
      <div class="flex justify-end mb-4">
        <button @click="toggleDark"
          class="text-sm px-4 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors duration-200 flex items-center gap-2"
          :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
          :title="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'">
          <component :is="isDark ? SunIcon : MoonIcon" class="w-5 h-5" aria-hidden="true" />
          <span class="sr-only">{{ isDark ? 'Claro' : 'Escuro' }}</span>
        </button>
      </div>

      <h1 class="text-3xl font-bold mb-6 text-center">🔐 Password Generator</h1>

      <form @submit.prevent="generate" class="space-y-4 bg-white dark:bg-zinc-800 p-6 rounded shadow">
        <label class="block">
          <span class="font-semibold">Length:</span>
          <input type="number" min="1" v-model.number="form.length"
            class="w-full mt-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-black dark:text-white" />
        </label>

        <div class="grid grid-cols-2 gap-4">
          <label><input type="checkbox" v-model="form.uppercase" class="mr-2" /> Uppercase</label>
          <label><input type="checkbox" v-model="form.lowercase" class="mr-2" /> Lowercase</label>
          <label><input type="checkbox" v-model="form.numbers" class="mr-2" /> Numbers</label>
          <label><input type="checkbox" v-model="form.symbols" class="mr-2" /> Symbols</label>
        </div>

        <label class="block">
          <span class="font-semibold">Quantity:</span>
          <input type="number" min="1" v-model.number="form.quantity"
            class="w-full mt-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-black dark:text-white" />
        </label>

        <label class="block">
          <span class="font-semibold">Format:</span>
          <select v-model="form.format"
            class="w-full mt-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-black dark:text-white">
            <option value="json">JSON</option>
            <option value="text">Text</option>
            <option value="csv">CSV</option>
            <option value="xml">XML</option>
            <option value="yaml">YAML</option>
            <option value="html">HTML</option>
          </select>
        </label>

        <label class="block">
          <span class="font-semibold">Separator (for text/csv):</span>
          <input type="text" v-model="form.separator"
            class="w-full mt-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-black dark:text-white" />
        </label>

        <label class="block">
          <input type="checkbox" v-model="form.quoted" class="mr-2" />
          Wrap each password with quotes
        </label>

        <label class="block">
          <span class="font-semibold">Filename:</span>
          <input type="text" v-model="filename"
            class="w-full mt-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-black dark:text-white" />
        </label>

        <button type="submit"
          class="w-full px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 transition">
          Generate
        </button>
      </form>

      <div v-if="result" class="mt-6 bg-gray-100 dark:bg-zinc-800 p-4 rounded">
        <h2 class="text-xl font-semibold mb-2">Result:</h2>

        <div v-if="form.format === 'html'" v-html="result" class="prose dark:prose-invert max-w-none" />
        <pre v-else class="whitespace-pre-wrap break-words">{{ result }}</pre>

        <div class="mt-4 flex gap-4">
          <button @click="copyToClipboard"
            class="px-4 py-2 rounded border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-700">
            📋 Copy
          </button>
          <button @click="downloadFile"
            class="px-4 py-2 rounded border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-700">
            ⬇️ Download
          </button>
        </div>

        <p v-if="contentType" class="text-sm mt-2 text-gray-500">
          Content-Type: {{ contentType }}
        </p>
      </div>
    </div>
  </div>
</template>
