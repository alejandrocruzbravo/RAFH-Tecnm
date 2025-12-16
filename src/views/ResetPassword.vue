<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 px-4">
    <div class="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-white mb-6 text-center">Nueva Contraseña</h2>

      <form @submit.prevent="submit">
        <div class="mb-4">
            <label class="block text-gray-400 text-sm mb-2">Correo</label>
            <input v-model="form.email" type="email" disabled class="w-full px-3 py-2 bg-gray-700 text-gray-500 rounded cursor-not-allowed">
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-400 text-sm mb-2">Nueva Contraseña</label>
          <input v-model="form.password" type="password" required minlength="6"
            class="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500">
        </div>

        <div class="mb-6">
          <label class="block text-gray-400 text-sm mb-2">Confirmar Contraseña</label>
          <input v-model="form.password_confirmation" type="password" required
            class="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500">
        </div>
        
        <button type="submit" :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
          {{ loading ? 'Actualizando...' : 'Restablecer Contraseña' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { API_CONFIG } from '../config/api';

const route = useRoute();
const router = useRouter();
const loading = ref(false);

const form = ref({
    token: '',
    email: '',
    password: '',
    password_confirmation: ''
});

onMounted(() => {
    // Obtenemos el token y el email de la URL del navegador
    form.value.token = route.query.token;
    form.value.email = route.query.email;
});

const submit = async () => {
    loading.value = true;
    try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form.value)
        });
        
        const data = await res.json();
        
        if (res.ok) {
            alert('Contraseña restablecida correctamente. Inicia sesión.');
            router.push('/'); // Redirige al login
        } else {
            alert(data.email || 'Error al restablecer contraseña');
        }
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};
</script>