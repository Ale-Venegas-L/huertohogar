package com.dsy.huertohogar.ui.screen

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.dsy.huertohogar.navigation.Screen
import com.dsy.huertohogar.ui.components.Boton
import com.dsy.huertohogar.ui.components.CampoTexto
import com.dsy.huertohogar.ui.components.Espaciador
import com.dsy.huertohogar.viewmodel.LoginViewModel
import kotlinx.coroutines.launch

// LoginScreen.kt
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    navController: NavController,
    viewModel: LoginViewModel
) {
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var isLoading by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Logo or Icon
        Icon(
            imageVector = Icons.Default.AccountCircle,
            contentDescription = "Logo",
            modifier = Modifier.size(120.dp),
            tint = MaterialTheme.colorScheme.primary
        )

        Espaciador()
        Espaciador()

        // Title
        Text(
            "Iniciar Sesión",
            style = MaterialTheme.typography.headlineSmall
        )

        Espaciador()
        Espaciador()

        // Username Field
        CampoTexto(
            valor = username,
            onValorChange = { username = it },
            etiqueta = "Usuario",
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

        errorMessage?.let {
            Espaciador()
            Text(
                text = it,
                color = MaterialTheme.colorScheme.error
            )
        }

        Espaciador()
        Espaciador()

        // Login Button
        Boton(
            texto = if (isLoading) "Iniciando sesión..." else "Iniciar Sesión",
            onClick = {
                if (username.isBlank() || password.isBlank()) {
                    errorMessage = "Por favor complete todos los campos"
                } else {
                    scope.launch {
                        isLoading = true
                        errorMessage = null
                        try {
                            val usuario = viewModel.autenticar(username, password)
                            if (usuario != null) {
                                navController.navigate(Screen.Home.route) {
                                    popUpTo(Screen.Login.route) { inclusive = true }
                                }
                            } else {
                                errorMessage = "Usuario o contraseña incorrectos"
                            }
                        } catch (e: Exception) {
                            errorMessage = "Error al iniciar sesión"
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

        // Register Link
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("¿No tienes cuenta?")
            TextButton(
                onClick = { navController.navigate(Screen.Registro.route) }
            ) {
                Text("Regístrate")
            }
        }
    }
}