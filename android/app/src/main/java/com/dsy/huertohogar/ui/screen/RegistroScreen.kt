package com.dsy.huertohogar.ui.screen

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PersonAdd
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.dsy.huertohogar.navigation.Screen
import com.dsy.huertohogar.ui.components.*
import com.dsy.huertohogar.viewmodel.RegistroViewModel
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegistroScreen(
    navController: NavController,
    viewModel: RegistroViewModel
) {
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var isLoading by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(32.dp))

        // Logo or Icon
        Icon(
            imageVector = Icons.Default.PersonAdd,
            contentDescription = "Registro",
            modifier = Modifier.size(100.dp),
            tint = MaterialTheme.colorScheme.primary
        )

        Espaciador()
        Espaciador()

        // Title
        Text(
            "Crear Cuenta",
            style = MaterialTheme.typography.headlineSmall
        )

        Espaciador()
        Espaciador()

        // Username Field
        CampoTexto(
            valor = username,
            onValorChange = { username = it },
            etiqueta = "Nombre de usuario",
            modificador = Modifier.fillMaxWidth()
        )

        Espaciador()

        // Password Field
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Contraseña") },
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            modifier = Modifier.fillMaxWidth()
        )

        Espaciador()

        // Confirm Password Field
        OutlinedTextField(
            value = confirmPassword,
            onValueChange = { confirmPassword = it },
            label = { Text("Confirmar contraseña") },
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            modifier = Modifier.fillMaxWidth()
        )

        errorMessage?.let {
            Espaciador()
            Text(
                text = it,
                color = MaterialTheme.colorScheme.error
            )
        }

        Espaciador()
        Espaciador()

        // Register Button
        Boton(
            texto = if (isLoading) "Registrando..." else "Registrarse",
            onClick = {
                if (username.isBlank() || password.isBlank() || confirmPassword.isBlank()) {
                    errorMessage = "Por favor complete todos los campos"
                } else if (password != confirmPassword) {
                    errorMessage = "Las contraseñas no coinciden"
                } else {
                    scope.launch {
                        isLoading = true
                        errorMessage = null
                        try {
                            viewModel.registrarUsuario(username, password)
                            navController.navigate(Screen.Login.route) {
                                popUpTo(Screen.Registro.route) { inclusive = true }
                                // Show success message on login screen
                                navController.currentBackStackEntry?.savedStateHandle?.set(
                                    "registration_success",
                                    "¡Registro exitoso! Por favor inicia sesión."
                                )
                            }
                        } catch (e: Exception) {
                            errorMessage = "Error al registrar: ${e.message}"
                        } finally {
                            isLoading = false
                        }
                    }
                }
            },
            modificador = Modifier
                .fillMaxWidth()
                .height(50.dp)
        )

        Espaciador()

        // Login Link
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("¿Ya tienes cuenta?")
            TextButton(
                onClick = { navController.navigate(Screen.Login.route) }
            ) {
                Text("Inicia sesión")
            }
        }

        Spacer(modifier = Modifier.height(32.dp))
    }
}