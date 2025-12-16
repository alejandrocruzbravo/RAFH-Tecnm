<template>
  <nav class="p-4 space-y-2">
    <RouterLink to="/resguardante" @click="$emit('closeSidebar')"
      class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
      <svg class="w-6 h-6 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
        <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
      <label class="px-2 cursor-pointer">Vista general</label>
    </RouterLink>

    <RouterLink to="/resguardante/bienes-asignados" @click="$emit('closeSidebar')"
      class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
      <svg class="w-6 h-6 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linejoin="round" stroke-width="2"
          d="M10 12v1h4v-1m4 7H6a1 1 0 0 1-1-1V9h14v9a1 1 0 0 1-1 1ZM4 5h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
      </svg>
      <label class="px-2 cursor-pointer">Bienes asignados</label>
    </RouterLink>

    <RouterLink v-if="esJefeDepto" to="/resguardante/bienes-departamento" @click="$emit('closeSidebar')"
      class="flex px-4 py-3 mb-2 text-purple-900 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-200 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition border border-purple-200 dark:border-purple-800">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
        </path>
      </svg>
      <label class="px-2 font-semibold cursor-pointer">Mi Departamento</label>
    </RouterLink>

    <RouterLink to="/resguardante/movimientos" @click="$emit('closeSidebar')"
      class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
      <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
        viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="m7 16 4-4-4-4m6 8 4-4-4-4" />
      </svg>
      <label class="px-2 cursor-pointer">Movimientos</label>
    </RouterLink>

    <RouterLink to="/resguardante/transferencias" @click="$emit('closeSidebar')"
      class="flex px-4 py-3 mb-2 text-blue-900 dark:text-gray-300 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-700 transition">
      <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
        width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3" />
      </svg>
      <label class="px-2 cursor-pointer">Traspasos</label>
    </RouterLink>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { ref, onMounted } from 'vue';

defineEmits(['closeSidebar']);
const esJefeDepto = ref(false);

onMounted(() => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    esJefeDepto.value = (user.usuario_id_rol === 4);
  }
});
</script>