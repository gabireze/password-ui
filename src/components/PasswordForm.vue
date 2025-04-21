<script setup lang="ts">
import { ArrowPathIcon } from "@heroicons/vue/24/solid";

defineProps<{
  form: any;
  filename: string;
  isLoading: boolean;
}>();

const emit = defineEmits(["generate", "update:filename"]);

const updateFilename = (event: Event) => {
  emit("update:filename", (event.target as HTMLInputElement).value);
};
</script>

<template>
  <form
    @submit.prevent="emit('generate')"
    class="space-y-4 bg-white dark:bg-zinc-800 p-6 rounded shadow"
  >
    <label class="block">
      <span class="font-semibold">Length:</span>
      <input
        type="number"
        min="1"
        v-model.number="form.length"
        class="w-full mt-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-black dark:text-white"
      />
    </label>

    <div class="grid grid-cols-2 gap-4">
      <label
        ><input type="checkbox" v-model="form.uppercase" class="mr-2" />
        Uppercase</label
      >
      <label
        ><input type="checkbox" v-model="form.lowercase" class="mr-2" />
        Lowercase</label
      >
      <label
        ><input type="checkbox" v-model="form.numbers" class="mr-2" />
        Numbers</label
      >
      <label
        ><input type="checkbox" v-model="form.symbols" class="mr-2" />
        Symbols</label
      >
    </div>

    <label class="block">
      <span class="font-semibold">Quantity:</span>
      <input
        type="number"
        min="1"
        v-model.number="form.quantity"
        class="w-full mt-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-black dark:text-white"
      />
    </label>

    <label class="block">
      <span class="font-semibold">Format:</span>
      <select
        v-model="form.format"
        class="w-full mt-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-black dark:text-white"
      >
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
      <input
        type="text"
        v-model="form.separator"
        class="w-full mt-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-black dark:text-white"
      />
    </label>

    <label class="block">
      <input type="checkbox" v-model="form.quoted" class="mr-2" />
      Wrap each password with quotes
    </label>

    <label class="block">
      <span class="font-semibold">Filename:</span>
      <input
        type="text"
        name="filename"
        :value="filename"
        @input="updateFilename"
        class="w-full mt-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-black dark:text-white"
      />
    </label>

    <button
      type="submit"
      class="w-full px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
      :disabled="isLoading"
    >
      <ArrowPathIcon v-if="isLoading" class="w-5 h-5 animate-spin" />
      <span>{{ isLoading ? "Generating..." : "Generate" }}</span>
    </button>
  </form>
</template>
