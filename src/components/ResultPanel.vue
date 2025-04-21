<script setup lang="ts">
const props = defineProps<{
  result: string;
  format: string;
  contentType: string;
  filename: string;
}>();

const copyToClipboard = async () => {
  await navigator.clipboard.writeText(props.result);
  alert("Copied to clipboard!");
};

const downloadFile = () => {
  const blob = new Blob([props.result], {
    type: props.contentType || "text/plain",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${props.filename}.${props.format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<template>
  <div class="mt-6 bg-gray-100 dark:bg-zinc-800 p-4 rounded">
    <h2 class="text-xl font-semibold mb-2">Result:</h2>

    <div
      v-if="format === 'html'"
      v-html="result"
      class="prose dark:prose-invert max-w-none"
    />
    <pre v-else class="whitespace-pre-wrap break-words">{{ result }}</pre>

    <div class="mt-4 flex gap-4">
      <button
        @click="copyToClipboard"
        class="px-4 py-2 rounded border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-700"
      >
        📋 Copy
      </button>
      <button
        @click="downloadFile"
        class="px-4 py-2 rounded border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-700"
      >
        ⬇️ Download
      </button>
    </div>

    <p v-if="contentType" class="text-sm mt-2 text-gray-500">
      Content-Type: {{ contentType }}
    </p>
  </div>
</template>
