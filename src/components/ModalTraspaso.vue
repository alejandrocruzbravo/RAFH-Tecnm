<template>
  <div>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div class="bg-white dark:bg-dark-bg rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700">

        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Traspasar Bien</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Bien: {{ bien?.bien_descripcion || 'Seleccionado' }}</p>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar nuevo resguardante</label>
            <div class="relative">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Escribe el nombre del empleado..." 
                class="uppercase w-full pl-10 pr-20 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-border text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                @keyup.enter="handleSearch"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              
              <button 
                @click="handleSearch"
                :disabled="isLoading"
                class="absolute right-1.5 top-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs rounded-md transition-colors"
              >
                {{ isLoading ? '...' : 'Buscar' }}
              </button>
            </div>
            <p v-if="errorMessage" class="text-xs text-red-500 mt-1">{{ errorMessage }}</p>
          </div>

          <div v-if="searchResults.length > 0 && !selectedUser" class="space-y-2 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2">
              <p class="text-xs text-gray-500 px-2">Resultados de la búsqueda:</p>
              <div 
                  v-for="user in searchResults" 
                  :key="user.id"
                  @click="user.tiene_usuario ? selectUser(user) : null"
                  :class="[
                      'flex items-center gap-3 p-2 rounded-lg transition-colors',
                      user.tiene_usuario 
                          ? 'hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer' 
                          : 'opacity-75 cursor-not-allowed bg-red-50 dark:bg-red-900/10'
                  ]"
              >
                  <div :class="[
                      'h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                      user.tiene_usuario ? 'bg-blue-100 text-blue-600' : 'bg-gray-300 text-gray-600'
                  ]">
                      {{ user.iniciales }}
                  </div>
                  <div class="flex-1">
                      <p class="text-sm font-bold text-gray-900 dark:text-white">{{ user.nombre }}</p>
                      <p class="text-xs text-gray-500">{{ user.cargo }}</p>
                      <p v-if="!user.tiene_usuario" class="text-xs text-red-600 dark:text-red-400 mt-1 font-semibold flex items-center gap-1">
                          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                          Notificar a Almacén para creación de usuario
                      </p>
                  </div>
              </div>
          </div>

          <div v-if="selectedUser" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center gap-4 animate-fade-in">
            <div class="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xl">
              {{ selectedUser.iniciales }}
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-gray-900 dark:text-white">{{ selectedUser.nombre }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ selectedUser.correo }}</p>
              <p class="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">{{ selectedUser.cargo }}</p>
            </div>
            <button @click="clearSelection" class="text-gray-400 hover:text-red-500 transition-colors" title="Quitar selección">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div v-else-if="searchResults.length === 0 && !isLoading" class="text-center py-4 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <p class="text-sm">Realiza una búsqueda para seleccionar al nuevo responsable.</p>
          </div>

        </div>

        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button 
            @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button 
            @click="handleConfirmarTraspaso" 
            :disabled="!selectedUser || isSubmitting"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2"
          >
            <svg v-if="isSubmitting" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            
            {{ isSubmitting ? 'Enviando...' : 'Confirmar Traspaso' }}
          </button>
        </div>
      </div>
    </div>

    <ModalExito 
        :show="showSuccessModal" 
        title="Solicitud Enviada"
        :message="successMessage"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import ModalExito from './ModalExito.vue' 

const props = defineProps({
  show: Boolean,
  bien: Object,
  fetchFunction: { type: Function, required: true }
})

const emit = defineEmits(['close', 'success'])

const searchQuery = ref('')
const searchResults = ref([])
const selectedUser = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const isSubmitting = ref(false);

const showSuccessModal = ref(false)
const successMessage = ref('')

// Limpiar todo al cerrar/abrir
watch(() => props.show, (newVal) => {
  if (!newVal) {
    searchQuery.value = ''
    searchResults.value = []
    selectedUser.value = null
    errorMessage.value = ''
  }
})

const handleSearch = async () => {
  if (searchQuery.value.length < 3) {
      errorMessage.value = 'Escribe al menos 3 letras para buscar.';
      return;
  }
  
  isLoading.value = true;
  errorMessage.value = '';
  selectedUser.value = null; 

  try {

      const term = searchQuery.value.toUpperCase();

      const response = await props.fetchFunction(`/resguardantes/search?query=${term}`);
      if (!response.ok) throw new Error('Error en la búsqueda');
  
      const data = await response.json();
      searchResults.value = data;
      
      if (data.length === 0) {
          errorMessage.value = 'No se encontraron resguardantes con ese nombre.';
      }
  } catch (err) {
      console.error(err);
      errorMessage.value = 'Error al conectar con el servidor.';
  } finally {
      isLoading.value = false;
  }
}

const selectUser = (user) => {
    selectedUser.value = user;
    searchResults.value = []; 
}

const clearSelection = () => {
    selectedUser.value = null;
    searchResults.value = []; 
}

const closeModal = () => {
    emit('close');
}

const handleConfirmarTraspaso = async () => {
    if (!props.bien || !selectedUser.value) return;

    isSubmitting.value = true;
    
    try {
        const payload = {
            traspaso_id_bien: props.bien.id,
            traspaso_id_usuario_destino: selectedUser.value.id,
            traspaso_observaciones: "Solicitud de traspaso generada por resguardante." 
        };

        const response = await props.fetchFunction('/traspasos', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al solicitar traspaso');
        }

        // --- ÉXITO ---
        successMessage.value = `Solicitud enviada al administrador para transferir a ${selectedUser.value.nombre}.`;
        showSuccessModal.value = true; // Activa el modal

        setTimeout(() => {
            showSuccessModal.value = false;
            emit('close'); 
            emit('success');
        }, 2000);

    } catch (error) {
        console.error(error);
        alert('Error: ' + error.message);
    } finally {
        isSubmitting.value = false;
    }
}
</script>