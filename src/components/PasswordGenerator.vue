<script setup lang="ts">
import { MoonIcon, SunIcon } from "@heroicons/vue/24/solid";
import axios from "axios";
import { ref } from "vue";

import PasswordForm from "@/components/PasswordForm.vue";
import ResultPanel from "@/components/ResultPanel.vue";
import { useTheme } from "@/composables/useTheme";

const apiUrl = "https://fssv2ttoh0.execute-api.sa-east-1.amazonaws.com";
const siteKey = "6LfuXh0rAAAAAKVllVFrkS5ZGhYsMoIsdkR9yKiP";

const { isDark, toggleDark } = useTheme();

const form = ref({
  length: 12,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  quantity: 3,
  format: "json",
  separator: "\n",
  quoted: true,
});

const filename = ref("passwords");
const result = ref("");
const contentType = ref("");
const isLoading = ref(false);

const generate = async () => {
  isLoading.value = true;
  try {
    const token = await (window as any).grecaptcha.execute(siteKey, {
      action: "generate",
    });

    const response = await axios.post(
      `${apiUrl}/password/generate`,
      {
        ...form.value,
        recaptchaToken: token,
      },
      {
        responseType: "text",
      },
    );

    result.value = response.data;
    contentType.value = response.headers["content-type"];
  } catch (err) {
    result.value = "Error: " + (err as any).message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300"
  >
    <div class="max-w-2xl mx-auto px-4 py-8">
      <div class="flex justify-end mb-4">
        <button
          @click="toggleDark"
          class="text-sm px-4 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors duration-200 flex items-center gap-2"
          :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
          :title="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
        >
          <component
            :is="isDark ? SunIcon : MoonIcon"
            class="w-5 h-5"
            aria-hidden="true"
          />
        </button>
      </div>

      <h1 class="text-3xl font-bold mb-6 text-center">🔐 Password Generator</h1>

      <PasswordForm
        :form="form"
        :filename="filename"
        :is-loading="isLoading"
        @generate="generate"
        @update:filename="(val) => (filename = val)"
      />

      <ResultPanel
        v-if="result"
        :result="result"
        :format="form.format"
        :filename="filename"
        :content-type="contentType"
      />
    </div>
  </div>
</template>
