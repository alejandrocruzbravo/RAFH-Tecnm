<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 px-4">
    <div class="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-white mb-6 text-center">Recuperar Contraseña</h2>
      
      <div v-if="status" class="mb-4 p-3 bg-green-900/50 text-green-400 rounded border border-green-800 text-sm">
        {{ status }}
      </div>
      
      <form @submit.prevent="submit">
        <div class="mb-6">
          <label class="block text-gray-400 text-sm font-bold mb-2">Correo Electrónico</label>
          <input v-model="email" type="email" required
            class="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500">
        </div>
        
        <button type="submit" :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none disabled:opacity-50">
          {{ loading ? 'Enviando...' : 'Enviar Enlace' }}
        </button>
        
        <div class="mt-4 text-center">
            <router-link to="/" class="text-sm text-gray-400 hover:text-white">Volver al Login</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { API_CONFIG } from '@/config/api.js'; // Ajusta ruta

const email = ref('');
const status = ref('');
const loading = ref(false);

const submit = async () => {
    loading.value = true;
    status.value = '';
    try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/forgot-password`, {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value })
        });
        const data = await res.json();
        if (res.ok) {
            status.value = data.status; // Mensaje de éxito
        } else {
            alert(data.email || 'Error al enviar el correo');
        }
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};
</script>