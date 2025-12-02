<template>
    <div class="h-screen bg-[#121212] text-white font-sans flex flex-col overflow-hidden">

        <div class="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 py-4 px-4 text-center shadow-lg relative shrink-0 z-20">
            <div class="absolute top-0 left-0 w-full h-full bg-white opacity-5 skew-x-12 transform -translate-x-1/2"></div>
            <h1 class="text-2xl font-extrabold tracking-wide mb-1 relative z-10">
                ¡Bienvenido a tus Centros de Trabajo!
            </h1>
            <p class="text-gray-200 text-sm relative z-10">
                Gestiona y accede a todos tus espacios laborales
            </p>
        </div>

        <div class="flex justify-center gap-4 py-3 px-4 shrink-0 bg-[#121212] z-10 border-b border-gray-800">
            <button @click="() => router.push('/nuevoCentro')"
                class="flex items-center gap-2 px-4 py-2 bg-[#1E1E1E] border border-gray-700 hover:bg-gray-800 rounded-lg text-white font-semibold transition-all shadow-md text-sm">
                <span class="text-lg">+</span> Crear Centro
            </button>
            <button
                class="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black rounded-lg font-bold transition-all shadow-md text-sm">
                Unirse a un Centro
            </button>
        </div>

        <div class="flex-1 flex flex-col lg:flex-row w-full overflow-hidden min-h-0 relative">
            
            <div class="hidden lg:block lg:flex-1 h-full relative z-0">
                <CentrosMap :centros="todosLosCentros" :active-center="hoveredCenter" />
                
                <div class="absolute top-4 left-4 z-[400] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 pointer-events-none">
                    <p class="text-xs text-gray-300">
                        <span class="text-cyan-400">●</span> Ubicaciones Geo-referenciadas
                    </p>
                </div>
            </div>

            <div class="w-full lg:w-[450px] h-full flex flex-col bg-[#121212] border-l border-gray-800 relative z-10 shadow-2xl">
                
                <div v-if="isLoading" class="p-10 text-center text-gray-400">Cargando...</div>
                
                <div v-else class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    
                    <div 
                        @mouseenter="handleMouseEnter(itchData)"
                        class="group relative bg-[#1E1E1E] rounded-xl overflow-hidden shadow-md border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer shrink-0 h-[220px]"
                    >
                        <div class="absolute inset-0 flex flex-col h-full">
                            <div class="h-32 w-full overflow-hidden relative">
                                <div class="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] to-transparent z-10"></div>
                                <img src="/images/tec.jpg" alt="ITCH" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                            </div>
                            <div class="flex-1 p-4 bg-[#1E1E1E] relative z-10 -mt-4">
                                <h3 class="text-base font-bold text-white leading-tight mb-1 group-hover:text-cyan-400 truncate">
                                    Instituto Tecnológico de Chetumal
                                </h3>
                                <div class="flex justify-between items-center mt-2">
                                    <p class="text-xs text-gray-400 truncate w-2/3">Chetumal, Quintana Roo</p>
                                    <span class="text-[10px] bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-900">
                                        📍 Mapa
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="absolute inset-0 bg-blue-900/95 backdrop-blur-sm p-5 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <h3 class="text-sm font-bold text-white mb-2 border-b border-blue-400 pb-1 w-full">Contacto</h3>
                            <div class="space-y-1 text-xs w-full text-left mb-3">
                                <div>
                                    <p class="text-blue-300 font-semibold uppercase tracking-wider text-[10px]">Dirección</p>
                                    <p class="text-white line-clamp-2">Av. Insurgentes 330, 17 de Octubre, 77013</p>
                                </div>
                                <div>
                                    <p class="text-blue-300 font-semibold uppercase tracking-wider text-[10px]">Teléfono</p>
                                    <p class="text-white font-mono">983 832 2330</p>
                                </div>
                            </div>
                            <button @click="() => router.push('/dashboard')"
                                class="px-6 py-2 bg-white text-blue-900 font-bold rounded-full hover:scale-105 transition-transform">
                                Entrar
                            </button>
                        </div>
                    </div>
                    <div v-for="centro in centros" :key="centro.id"
                        @mouseenter="handleMouseEnter(centro)"
                        class="group relative bg-[#1E1E1E] rounded-xl overflow-hidden shadow-md border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer shrink-0 h-[220px]"
                    >
                        <div class="absolute inset-0 flex flex-col h-full">
                            <div class="h-32 w-full overflow-hidden relative">
                                <div class="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] to-transparent z-10"></div>
                                <img :src="centro.imagen" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" @error="handleLogoError">
                            </div>
                            <div class="flex-1 p-4 bg-[#1E1E1E] relative z-10 -mt-4">
                                <h3 class="text-base font-bold text-white leading-tight mb-1 group-hover:text-cyan-400 truncate">
                                    {{ centro.nombre }}
                                </h3>
                                <div class="flex justify-between items-center mt-2">
                                    <p class="text-xs text-gray-400 truncate w-2/3">{{ centro.lugar }}</p>
                                    <span v-if="centro.tieneCoordenada" class="text-[10px] bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-900">
                                        📍 Mapa
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="absolute inset-0 bg-blue-900/95 backdrop-blur-sm p-5 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <button @click="() => router.push('/dashboard')"
                                class="px-6 py-2 bg-white text-blue-900 font-bold rounded-full hover:scale-105 transition-transform">
                                Entrar
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'; // Importamos Computed
import { useRouter } from 'vue-router';
import { API_CONFIG_2, authenticatedQueryAPI2 } from '../config/api.js';
import CentrosMap from '@/components/CentrosMap.vue';
import { coordenadasInstituciones } from '@/config/coordenadas.js';

const router = useRouter();
const centros = ref([]); // Lista API
const isLoading = ref(false);
const errorMessage = ref('');
const hoveredCenter = ref(null);

const fallbackLogo = '/images/qroo.jpg';

// --- DATOS DEL ITCH (Manual) ---
const itchData = {
    IdUbicacion: 'ITCH_MANUAL',
    nombre: 'Instituto Tecnológico de Chetumal',
    rol: 'Sede Principal',
    lugar: 'Chetumal, Quintana Roo',
    direccion: 'Av. Insurgentes 330, 17 de Octubre, 77013',
    telefono: '983 832 2330',
    lat: 18.51953456893983,
    lng: -88.30228428620103,
    tieneCoordenada: true
};

// --- COMPUTED PARA UNIR TODO EN EL MAPA ---
// El mapa necesita saber de AMBOS (ITCH + API) para pintar los pines
const todosLosCentros = computed(() => {
    return [itchData, ...centros.value];
});

const handleLogoError = (event) => {
    if (event.target.dataset.fallbackApplied) return;
    event.target.dataset.fallbackApplied = 'true';
    event.target.src = fallbackLogo;
};

const buildLogoUrl = (logo) => {
    if (!logo) return fallbackLogo;
    if (logo.startsWith('http')) return logo;
    return `${API_CONFIG_2.BASE_URL}${logo.startsWith('/') ? '' : '/'}${logo}`;
};

const handleMouseEnter = (centro) => {
    if (centro.tieneCoordenada) {
        hoveredCenter.value = centro;
    }
};

const mapInstitucionToCentro = (registro) => {
    const coords = coordenadasInstituciones[registro.IdUbicacion];
    const defaultLat = coordenadasInstituciones["DEFAULT"].lat;
    const defaultLng = coordenadasInstituciones["DEFAULT"].lng;

    return {
        id: registro.IdUbicacion,
        nombre: registro.Nombre_Institucion || 'Institución sin nombre',
        rol: registro.Nombramiento || 'Sin rol asignado',
        imagen: buildLogoUrl(registro.logo),
        lugar: [registro.Colonia, registro.CodigoPostal].filter(Boolean).join(', ') || 'Ubicación no disponible',
        direccion: [registro.Direccion, registro.Numero || 'S/N'].filter(Boolean).join(' ') || 'Dirección no disponible',
        telefono: [registro.Telefono, registro.Extension ? `Ext. ${registro.Extension}` : ''].filter(Boolean).join(' ') || 'Sin contacto',
        lat: coords ? coords.lat : defaultLat,
        lng: coords ? coords.lng : defaultLng,
        tieneCoordenada: !!coords
    };
};

const normalizeInstituciones = (payload) => {
    if (!payload) return [];
    let data = payload;
    if (Array.isArray(data)) {
        if (data.length === 1 && Array.isArray(data[0])) {
            data = data[0];
        } else if (Array.isArray(data[0])) {
            data = data.flat();
        }
        return data.filter((item) => item && typeof item === 'object');
    }
    if (Array.isArray(data?.data)) {
        return data.data.filter((item) => item && typeof item === 'object');
    }
    if (typeof data === 'object') {
        return Object.values(data).filter((item) => item && typeof item === 'object');
    }
    return [];
};

const extractInstituciones = (responseData) => {
    if (!responseData) return [];
    const tablas = responseData.datosTablas || responseData;
    const tablaInstituciones = tablas.comedatos_institucion;
    return normalizeInstituciones(tablaInstituciones);
};

const cargarCentros = async () => {
    const storedCredentials = sessionStorage.getItem('user_credentials');
    if (!storedCredentials) {
        errorMessage.value = 'No hay credenciales disponibles.';
        return;
    }
    const { email, password } = JSON.parse(storedCredentials);

    isLoading.value = true;
    errorMessage.value = '';

    try {
        const response = await authenticatedQueryAPI2(
            API_CONFIG_2.ENDPOINTS.LOGIN,
            email,
            password
        );
        const rawBody = await response.text();
        let data;
        try { data = rawBody ? JSON.parse(rawBody) : {}; } catch (e) { data = { raw: rawBody }; }

        if (response.ok) {
            const instituciones = extractInstituciones(data);
            centros.value = instituciones
                .filter((registro) => registro && registro.IdUbicacion)
                .map(mapInstitucionToCentro);
        } else {
            console.warn("Fallo API, cargando solo manuales");
        }
    } catch (error) {
        console.error('Error cargando centros:', error);
        errorMessage.value = error.message;
    } finally {
        isLoading.value = false;
    }
};

onMounted(cargarCentros);
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #1e1e1e;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #4b5563;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #6b7280;
}
</style>