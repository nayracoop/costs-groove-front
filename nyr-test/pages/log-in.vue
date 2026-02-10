<script setup>
import { ref } from 'vue'

definePageMeta({ layout: false })

const email = ref('')
const password = ref('')
const rememberMe = ref(false)

function onSubmit() {
	console.log('Login submit', { email: email.value, rememberMe: rememberMe.value })
}
</script>

<template>
	<div class="login-page">
		<div class="login-shell">
			<div class="login-hero">
				<div class="hero-badge">Sistemita</div>
				<h1 class="hero-title">Gestión de costos</h1>
				<p class="hero-copy">
					Accede a procesos, tableros y reportes en un solo lugar. Mantene el flujo de trabajo
					ordenado y siempre visible.
				</p>
				<div class="hero-accent"></div>
			</div>

			<div class="login-card">
				<div class="login-header">
					<h2>Iniciar sesion</h2>
					<p>Ingresa tus credenciales para continuar.</p>
				</div>

				<form class="login-form" @submit.prevent="onSubmit">
					<NyrInput
						v-model="email"
						label="Email"
						placeholder="nombre@bodega.com"
					/>
					<NyrInput
						v-model="password"
						label="Contrasena"
						placeholder="********"
						:type="'password'"
					/>
					<div class="login-options">
						<label class="remember">
							<input v-model="rememberMe" type="checkbox" />
							<span>Recordarme</span>
						</label>
						<button class="link" type="button">Olvide mi clave</button>
					</div>
					<NyrButton class="login-submit" type="submit">
						<NyrIcon icon="right-to-bracket" size="sm" class="mr-2" />
						Entrar
					</NyrButton>
				</form>

				<div class="login-footer">
					<span>Nuevo en Sistemita?</span>
					<button class="link" type="button">Solicitar acceso</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=Space+Grotesk:wght@400;500;600&display=swap');

.login-page {
	min-height: 100vh;
	background: radial-gradient(circle at top left, #e7dec8, #f4ecdd 55%, #efe3cf 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 32px 20px;
}

.login-shell {
	width: min(1100px, 100%);
	display: grid;
	grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
	gap: 32px;
}

.login-hero {
	background: linear-gradient(145deg, #3f2416, #6e634a 60%, #b1bca2 120%);
	border-radius: 28px;
	padding: 40px;
	color: #fefcf7;
	position: relative;
	overflow: hidden;
	box-shadow: 0 30px 60px rgba(45, 35, 22, 0.25);
}

.hero-badge {
	font-family: 'Space Grotesk', sans-serif;
	letter-spacing: 0.35em;
	font-size: 12px;
	font-weight: 600;
	text-transform: uppercase;
	opacity: 0.85;
}

.hero-title {
	font-family: 'Fraunces', serif;
	font-size: clamp(30px, 3.2vw, 44px);
	margin: 18px 0 16px;
}

.hero-copy {
	font-family: 'Space Grotesk', sans-serif;
	font-size: 16px;
	line-height: 1.7;
	max-width: 420px;
}

.hero-accent {
	position: absolute;
	width: 200px;
	height: 200px;
	border-radius: 40% 60% 55% 45%;
	background: rgba(244, 236, 221, 0.18);
	bottom: -50px;
	right: -30px;
	filter: blur(0.5px);
}

.login-card {
	background: #ffffff;
	border-radius: 24px;
	padding: 36px;
	box-shadow: 0 24px 50px rgba(33, 36, 30, 0.12);
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.login-header h2 {
	font-family: 'Fraunces', serif;
	font-size: 28px;
	margin: 0 0 6px;
	color: #21241e;
}

.login-header p {
	font-family: 'Space Grotesk', sans-serif;
	color: #6e634a;
	margin: 0;
}

.login-form {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.login-options {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-family: 'Space Grotesk', sans-serif;
	font-size: 14px;
}

.remember {
	display: flex;
	align-items: center;
	gap: 8px;
}

.link {
	background: transparent;
	border: none;
	color: #6e634a;
	font-weight: 600;
	cursor: pointer;
	padding: 0;
}

.login-submit {
	width: 100%;
	justify-content: center;
}

.login-footer {
	font-family: 'Space Grotesk', sans-serif;
	font-size: 14px;
	color: #6e634a;
	display: flex;
	gap: 8px;
	align-items: center;
}

@media (max-width: 960px) {
	.login-shell {
		grid-template-columns: 1fr;
	}

	.login-hero {
		padding: 32px;
	}
}
</style>
