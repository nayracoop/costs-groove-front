<script setup>
import { ref } from 'vue'

definePageMeta({ layout: 'admin' })

const userForm = ref({
	nombre: 'Señorita Nayra',
	email: 'nayra@viñedos-amanecer.com'
})

const passwordForm = ref({
	newPassword: '',
	confirmPassword: ''
})

const accountName = 'Viñedos El Amanecer'
const accountTier = 'Profesional'

function onSaveProfile() {
	console.log('Save profile:', userForm.value)
}

function onChangePassword() {
	console.log('Change password')
	// Reset password fields
	passwordForm.value = {
		newPassword: '',
		confirmPassword: ''
	}
}
</script>

<template>
	<div class="flex h-screen overflow-hidden">
		<Menu />
		<main class="flex-1 bg-cream overflow-y-auto">
			<div class="p-8">
				<div class="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
					<h1 class="text-2xl font-semibold text-charcoal mb-6">Mi Cuenta</h1>
					
					<!-- Account Info Display -->
					<div class="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm text-gray-600">Cuenta</p>
								<p class="text-lg font-medium text-charcoal">{{ accountName }}</p>
							</div>
							<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
								{{ accountTier }}
							</span>
						</div>
					</div>

					<!-- Profile Form -->
					<div class="space-y-6 mb-8">
						<h2 class="text-lg font-medium text-charcoal">Información Personal</h2>
						
						<NyrInput
							v-model="userForm.nombre"
							label="Nombre"
							placeholder="Ingrese su nombre"
						/>

						<NyrInput
							v-model="userForm.email"
							label="E-mail"
							placeholder="Ingrese su correo electrónico"
							type="email"
						/>

						<div class="flex justify-end">
							<NyrButton @click="onSaveProfile">
								Guardar cambios
							</NyrButton>
						</div>
					</div>

					<!-- Change Password Section -->
					<div class="pt-6 border-t border-gray-200">
						<h2 class="text-lg font-medium text-charcoal mb-6">Cambiar Contraseña</h2>
						
						<div class="space-y-4">
							<NyrInput
								v-model="passwordForm.newPassword"
								label="Nueva contraseña"
								placeholder="Ingrese su nueva contraseña"
								type="password"
							/>

							<NyrInput
								v-model="passwordForm.confirmPassword"
								label="Confirmar contraseña"
								placeholder="Confirme su nueva contraseña"
								type="password"
							/>

							<div class="flex justify-end">
								<NyrButton @click="onChangePassword">
									Cambiar contraseña
								</NyrButton>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>