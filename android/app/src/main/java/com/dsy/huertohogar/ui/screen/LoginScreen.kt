package com.dsy.huertohogar.ui.screen

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.dsy.huertohogar.navigation.Screen
import com.dsy.huertohogar.ui.components.Boton
import com.dsy.huertohogar.ui.components.CampoContraseña
import com.dsy.huertohogar.ui.components.CampoTexto
import com.dsy.huertohogar.ui.components.Espaciador
import com.dsy.huertohogar.ui.components.EspaciadorDoble
import com.dsy.huertohogar.viewmodel.LoginViewModel
import com.dsy.huertohogar.viewmodel.MainViewModel
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    navController: NavController,
    viewModel: LoginViewModel,
    mainViewModel: MainViewModel
) {
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var isLoading by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    LaunchedEffect(Unit) {
        if (mainViewModel.currentUser.value != null) {
            navController.navigate(Screen.Home.route) {
                popUpTo(Screen.Login.route) { inclusive = true }
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = Icons.Default.AccountCircle,
            contentDescription = "Logo",
            modifier = Modifier.size(120.dp),
            tint = MaterialTheme.colorScheme.primary
        )

        EspaciadorDoble()

        Text(
            "Iniciar Sesión",
            style = MaterialTheme.typography.headlineSmall
        )

        EspaciadorDoble()

        CampoTexto(
            valor = username,
            onValorChange = { username = it },
            etiqueta = "Usuario",
        )

        Espaciador()

        CampoContraseña(
            valor = password,
            onValorChange = {password=it},
            etiqueta = "Contraseña"
        )

        errorMessage?.let {
            Espaciador()
            Text(
                text = it,
                color = MaterialTheme.colorScheme.error
            )
        }

        EspaciadorDoble()

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
                                // Update the current user in MainViewModel
                                mainViewModel.setCurrentUser(usuario)
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