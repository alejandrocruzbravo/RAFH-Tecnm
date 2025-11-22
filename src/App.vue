<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isDashboard = computed(() => route.path.startsWith('/dashboard'))
const isResguardante = computed(() => route.path.startsWith('/resguardante'))
const hideNavbarFooter = computed(() => isDashboard || isResguardante)
</script>

<template>
	<div class="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
		<Navbar v-if="!hideNavbarFooter" :isCentroT="Boolean(route.meta.navbarCentroT)" />
		<main :class="['flex-grow', { 'pt-16': !hideNavbarFooter }]">
			<RouterView />
		</main>
		<Footer v-if="!hideNavbarFooter" />
	</div>
</template>
