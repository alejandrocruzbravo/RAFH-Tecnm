<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-xl font-bold text-gray-800 dark:text-white">Configuración de Etiquetas</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">Define cómo se generarán las claves de inventario
                    automáticamente.</p>
            </div>
            <button @click="saveConfiguration" :disabled="isSaving"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2">
                <span v-if="isSaving">Guardando...</span>
                <span v-else>Guardar Configuración</span>
            </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div class="lg:col-span-1 space-y-6">

                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Vista Previa
                        de Etiqueta</label>
                    <div class="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 flex items-center justify-center">
                        <span class="text-2xl font-mono font-bold text-gray-800 dark:text-blue-400 tracking-wider">
                            {{ previewLabel }}
                        </span>
                    </div>
                    <p class="text-xs text-center text-gray-400 mt-2">Ejemplo basado en categoría "Mobiliario"</p>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Estructura</h3>

                    <div class="space-y-5">

                        <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Prefijo
                                    Institucional</span>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="config.includeInstitution" class="sr-only peer">
                                    <div
                                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                                    </div>
                                </label>
                            </div>

                            <div v-if="config.includeInstitution"
                                class="grid grid-cols-2 gap-3 mt-3 animate-fade-in-down">
                                <div>
                                    <label class="block text-xs text-gray-500 mb-1">Siglas (Ej. GOB)</label>
                                    <input v-model="config.institutionPrefix" type="text" maxlength="5"
                                        placeholder="ITC"
                                        class="w-full px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white uppercase font-bold focus:ring-2 focus:ring-blue-500">
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-500 mb-1">Posición</label>
                                    <select v-model="config.institutionPosition"
                                        class="w-full px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500">
                                        <option value="start">Al Inicio (ITC-MOB...)</option>
                                        <option value="middle">En Medio (MOB-ITC...)</option>
                                        <option value="before_seq">Antes Consec. (...ITC-001)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Incluir Año</span>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="config.includeYear" class="sr-only peer">
                                    <div
                                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                                    </div>
                                </label>
                            </div>

                            <div v-if="config.includeYear" class="mt-3 pl-1 animate-fade-in-down">
                                <label class="block text-xs text-gray-500 mb-2">Formato del año:</label>
                                <div class="flex items-center gap-6">
                                    <label class="inline-flex items-center cursor-pointer group">
                                        <input type="radio" v-model="config.yearFormat" value="YYYY"
                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                                        <span
                                            class="ml-2 text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-500">
                                            Completo ({{ currentYear }})
                                        </span>
                                    </label>

                                    <label class="inline-flex items-center cursor-pointer group">
                                        <input type="radio" v-model="config.yearFormat" value="YY"
                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                                        <span
                                            class="ml-2 text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-500">
                                            Corto ({{ currentYear.toString().slice(-2) }})
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-700 dark:text-gray-300">Usar Separadores</span>
                            <select v-model="config.separator"
                                class="text-sm py-1 pl-3 pr-8 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
                                <option value="">Ninguno</option>
                                <option value="-">Guion (-)</option>
                                <option value="/">Barra (/)</option>
                                <option value=".">Punto (.)</option>
                            </select>
                        </div>

                        <div>
                            <div class="flex justify-between mb-1">
                                <label class="block text-sm text-gray-700 dark:text-gray-300">Longitud del
                                    Consecutivo</label>
                                <span class="text-sm font-mono font-bold text-blue-600">{{ config.zerosLength }}</span>
                            </div>
                            <input type="range" v-model.number="config.zerosLength" min="3" max="6"
                                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600">
                            <p class="text-xs text-gray-500 mt-1">Ej: {{ '1'.padStart(config.zerosLength, '0') }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-2">
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-full max-h-[600px]">
                    <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 shrink-0">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Diccionario de Prefijos</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Asigna un código corto a cada clasificación
                            oficial.</p>
                    </div>

                    <div class="flex-1 overflow-hidden relative">
                        <div class="overflow-y-auto h-full custom-scrollbar">
                            <table class="w-full text-sm text-left border-collapse">
                                <thead
                                    class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th class="px-6 py-3 w-1/2 bg-gray-100 dark:bg-gray-700">Clasificación Oficial</th>
                                        <th class="px-6 py-3 w-1/4 text-center bg-gray-100 dark:bg-gray-700">Tu Prefijo
                                        </th>
                                        <th class="px-6 py-3 w-1/4 text-right bg-gray-100 dark:bg-gray-700">Resultado
                                            Ejemplo</th>
                                    </tr>
                                </thead>

                                <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
                                    <tr v-if="isLoading">
                                        <td colspan="3" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            Cargando...
                                        </td>
                                    </tr>

                                    <tr v-else v-for="cat in categoryMappings" :key="cat.api_code"
                                        class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td class="px-6 py-4 font-medium text-gray-900 dark:text-white align-middle">
                                            {{ cat.api_name }}
                                            <div class="flex gap-2 mt-1">
                                                <span
                                                    class="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                                                    Partida {{ cat.api_code }}
                                                </span>
                                                <span class="text-xs text-gray-400 font-mono self-center">
                                                    {{ cat.secondary_code }}
                                                </span>
                                            </div>
                                        </td>

                                        <td class="px-6 py-4 align-middle text-center">
                                            <input type="text" v-model="cat.user_prefix" maxlength="10"
                                                class="w-full max-w-[120px] px-2 py-1 text-center font-bold uppercase border rounded border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-blue-400 focus:ring-2 focus:ring-blue-500 mx-auto"
                                                placeholder="---">
                                        </td>

                                        <td
                                            class="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs text-right align-middle">
                                            {{ generateExample(cat.user_prefix) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <transition enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="notification.show"
            class="fixed bottom-4 right-4 z-50 max-w-sm w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden ring-1 ring-black ring-opacity-5">
            <div class="p-4"
                :class="notification.type === 'success' ? 'bg-white dark:bg-gray-800 border-l-4 border-green-500' : 'bg-white dark:bg-gray-800 border-l-4 border-red-500'">
                <div class="flex items-start">
                    <div class="flex-shrink-0" v-if="notification.type === 'success'">
                        <svg class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="flex-shrink-0" v-else>
                        <svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <div class="ml-3 w-0 flex-1 pt-0.5">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ notification.type === 'success' ? '¡Éxito!' : 'Error' }}
                        </p>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {{ notification.message }}
                        </p>
                    </div>
                    <div class="ml-4 flex-shrink-0 flex">
                        <button @click="notification.show = false"
                            class="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none">
                            <span class="sr-only">Cerrar</span>
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { authenticatedQueryAPI2, API_CONFIG_2 } from '../config/api.js'
import { authenticatedFetch } from '../config/api.js'

const isSaving = ref(false)
const isLoading = ref(true)
const currentYear = new Date().getFullYear()
const emit = defineEmits(['saved'])
// Configuración Estructural (Valores por defecto)
const config = ref({
    includeYear: true,
    yearFormat: 'YYYY', // Nuevo valor por defecto: 'YYYY' (2025) o 'YY' (25)
    separator: '-',
    zerosLength: 4,
    includeInstitution: false,      // Toggle para activar
    institutionPrefix: '',          // El texto (Ej. "ITC")
    institutionPosition: 'start'    // Dónde se pone: 'start', 'middle', 'end'
})
const notification = ref({
    show: false,
    message: '',
    type: 'success' // 'success' | 'error'
})

const categoryMappings = ref([])

onMounted(async () => {
    await loadData()
})

const loadData = async () => {
    isLoading.value = true

    try {
        const storedCredentials = sessionStorage.getItem('user_credentials');

        if (!storedCredentials) {
            errorMessage.value = 'No hay credenciales disponibles. Inicia sesión nuevamente.';
            return;
        }

        const { email, password } = JSON.parse(storedCredentials);


        // 3. LLAMADA A LA API
        const response = await authenticatedQueryAPI2(
            API_CONFIG_2.ENDPOINTS.LOGIN,
            email,
            password,
            {
                // Si tu API requiere especificar qué tabla quieres, úsalo aquí.
                // Si devuelve todo por defecto, deja el body vacío.
                // body: { accion: 'obtener_catalogos' } 
            }
        )

        const rawBody = await response.text()
        let data

        try {
            data = rawBody ? JSON.parse(rawBody) : {}
        } catch (parseError) {
            console.error('Error parseando JSON:', rawBody)
            data = { raw: rawBody }
        }

        if (!response.ok) {
            throw new Error(data.message || 'Error al conectar con NucleoDigital')
        }

        // 4. EXTRAER LA TABLA "h25_cat_clasificacion_bienes"
        // Según tu Postman, esto suele venir dentro de 'datosTablas'
        // Agregamos validaciones de seguridad (?.) para que no truene si viene null
        const rawList = data.datosTablas?.h25_cat_subcuentas_bienes || 
                        data.h25_cat_subcuentas_bienes || 
                        [];

        // --- FILTRADO NUEVO: SOLO LOS QUE TENGAN CLAVE DE GASTO ---
        const listaOficial = rawList.filter(item => 
            item.clave_gasto && item.clave_gasto.trim() !== ''
        );

        if (listaOficial.length === 0) {
            console.warn('Alerta: No se encontraron registros con clave_gasto válida.')
        }

        // 5. CARGAR CONFIGURACIÓN GUARDADA (LocalStorage)
        const savedConfigRaw = localStorage.getItem('app_inventory_config')
        const savedConfig = savedConfigRaw ? JSON.parse(savedConfigRaw) : null

        if (savedConfig && savedConfig.structure) {
            config.value = savedConfig.structure
        }

        // 6. FUSIONAR DATOS (API + USUARIO)
        categoryMappings.value = listaOficial.map(item => {
            // AHORA LA LLAVE ES 'clave_gasto' (Ej. "511", "515")
            // Si el item no tiene clave_gasto (ej. bienes inmuebles), usamos el código
            const key = item.clave_gasto || item.codigo

            const savedPrefix = savedConfig?.prefixes?.find(p => p.api_code === key)?.prefix

            return {
                id: item.id,
                api_code: key,           // Guardamos "511" aquí
                secondary_code: item.codigo, // Guardamos "1.2.4.1.1" solo visualmente
                api_name: item.nombre,
                user_prefix: savedPrefix || generateDefaultPrefix(item.nombre)
            }
        })

        // Opcional: Ordenar por clave de gasto para que salga 511, 515, 521...
        categoryMappings.value.sort((a, b) => a.api_code.localeCompare(b.api_code))

    } catch (error) {
        console.error('Error en loadData:', error)
        showNotification('Error al cargar catálogo de cuentas', 'error')
    } finally {
        isLoading.value = false
    }
}

// --- UTILIDADES ---

// Generador de prefijos (ej. "Muebles" -> "MUE")
const generateDefaultPrefix = (name) => {
    if (!name) return 'GEN'
    // Eliminar palabras cortas (de, y, para...) y tomar las primeras 3 letras
    const cleanName = name.replace(/\b(de|y|para|el|la)\b/gi, '').trim()
    return cleanName.substring(0, 3).toUpperCase()
}

// Generador visual del ejemplo
// 2. Actualizamos el Generador Visual
const generateExample = (catPrefix) => {
    const p_cat = catPrefix ? catPrefix.toUpperCase() : 'CAT'
    const p_inst = config.value.institutionPrefix ? config.value.institutionPrefix.toUpperCase() : 'INST'
    const p_seq = '1'.padStart(config.value.zerosLength, '0')

    // --- NUEVA LÓGICA DE AÑO ---
    const yearStr = currentYear.toString()
    // Si elige 'YY', cortamos los últimos 2 dígitos (slice -2)
    const p_year = config.value.yearFormat === 'YY' ? yearStr.slice(-2) : yearStr

    let parts = []

    // Lógica de posición Institucional (igual que antes)
    if (config.value.includeInstitution) {
        if (config.value.institutionPosition === 'start') {
            parts.push(p_inst); parts.push(p_cat)
        } else if (config.value.institutionPosition === 'middle') {
            parts.push(p_cat); parts.push(p_inst)
        } else {
            parts.push(p_cat)
        }
    } else {
        parts.push(p_cat)
    }

    // Insertar Año (Formateado)
    if (config.value.includeYear) {
        parts.push(p_year)
    }

    // Institucional al final (antes del seq)
    if (config.value.includeInstitution && config.value.institutionPosition === 'before_seq') {
        parts.push(p_inst)
    }

    parts.push(p_seq)
    return parts.join(config.value.separator)
}

const previewLabel = computed(() => {
    if (categoryMappings.value.length === 0) return 'Cargando...'
    const sample = categoryMappings.value[0]
    return generateExample(sample.user_prefix)
})

// --- GUARDAR ---
const saveConfiguration = async () => {
    isSaving.value = true
    try {
        const payload = {
            structure: config.value,
            prefixes: categoryMappings.value.map(c => ({
                api_code: c.api_code,
                prefix: c.user_prefix.toUpperCase()
            }))
        }

        // --- PETICIÓN AL BACKEND (Laravel) ---
        // Enviamos el POST a la ruta que creamos en api.php
        const response = await authenticatedFetch('/configuracion-inventario', {
            method: 'POST',
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            throw new Error('Error al guardar en el servidor.')
        }

        // Si quieres, también actualizamos el localStorage como respaldo caché
        localStorage.setItem('app_inventory_config', JSON.stringify(payload))

        // --- FEEDBACK VISUAL PROFESIONAL ---
        showNotification('Configuración guardada y aplicada correctamente.', 'success')
        emit('saved')

    } catch (error) {
        console.error(error)
        showNotification('Hubo un error al guardar la configuración.', 'error')
    } finally {
        isSaving.value = false
    }
}

const showNotification = (msg, type = 'success') => {
    notification.value = { show: true, message: msg, type }
    // Ocultar automáticamente después de 3 segundos
    setTimeout(() => {
        notification.value.show = false
    }, 3000)
}
</script>