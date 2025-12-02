<template>
    <div ref="mapContainer" class="h-full w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 relative z-0 bg-gray-200 dark:bg-gray-800">
        <l-map 
            ref="mapRef"
            v-model:zoom="zoom" 
            :center="center" 
            :use-global-leaflet="false"
            :options="{ zoomControl: false }"
            style="height: 100%; width: 100%; position: absolute; top: 0; left: 0;"
            @ready="onMapReady"
        >
            <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
            ></l-tile-layer>

            <l-control-zoom position="bottomright"></l-control-zoom>

            <l-marker 
                v-for="item in centros" 
                :key="item.id" 
                :lat-lng="[item.lat, item.lng]"
            >
                <l-popup>
                    <div class="text-center">
                        <h3 class="font-bold text-sm text-gray-800">{{ item.nombre }}</h3>
                        <p class="text-xs text-gray-500">{{ item.rol }}</p>
                    </div>
                </l-popup>
            </l-marker>
        </l-map>
    </div>
</template>

<script setup>
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker, LPopup, LControlZoom } from "@vue-leaflet/vue-leaflet";
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import L from 'leaflet';

const props = defineProps({
    centros: { type: Array, required: true },
    activeCenter: { type: Object, default: null }
});

const zoom = ref(13);
const center = ref([18.509749, -88.292372]);
const mapRef = ref(null);
const mapInstance = ref(null);
const mapContainer = ref(null);
let resizeObserver = null;

// --- 1. Inicialización y Fix de Tamaño ---
const onMapReady = (mapObject) => {
    mapInstance.value = mapObject;
    
    // Inmediatamente
    mapObject.invalidateSize();

    // A los 500ms (para asegurar que el layout cargó)
    setTimeout(() => {
        mapObject.invalidateSize();
    }, 500);
};

// --- 2. Observador de Redimensionamiento (ResizeObserver) ---
// Esto es lo que faltaba: Si el div contenedor cambia de tamaño, avisamos al mapa.
onMounted(() => {
    // Fix de iconos
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
        iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
        shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
    });
    [100, 500, 1000].forEach(time => {
        setTimeout(() => {
            if (mapRef.value && mapRef.value.leafletObject) {
                mapRef.value.leafletObject.invalidateSize();
            }
        }, time);
    });
});

onUnmounted(() => {
    if (resizeObserver) resizeObserver.disconnect();
});

// --- 3. Watcher para Hover ---
watch(() => props.activeCenter, (newCenter) => {
    if (newCenter && newCenter.lat && newCenter.lng && mapInstance.value) {
        mapInstance.value.flyTo([newCenter.lat, newCenter.lng], 16, {
            animate: true,
            duration: 1.5
        });
    }
});
</script>