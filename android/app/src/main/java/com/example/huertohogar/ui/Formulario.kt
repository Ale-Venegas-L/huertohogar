package com.example.huertohogar.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.navigation.NavController
import com.example.huertohogar.navigation.Screen
import com.example.huertohogar.viewmodels.FormularioViewModel
import com.example.huertohogar.viewmodels.MainViewModel
import androidx.compose.runtime.rememberCoroutineScope
import kotlinx.coroutines.launch

@Composable
fun Formulario(navController: NavController, viewModel: FormularioViewModel, mainViewModel: MainViewModel){
    var nombre by remember { mutableStateOf("") }
    var contrasena by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    val usuarios by viewModel.usuarios.collectAsState()

    Column(
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ){
        OutlinedTextField(
            value = nombre,
            onValueChange = {nombre=it},
            label = { Text(text = "Ingrese nombre: ") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(8.dp))

        OutlinedTextField(
            value = contrasena,
            onValueChange = {contrasena=it},
            label = { Text(text = "Ingrese contraseña: ") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(8.dp))

        Button(
            onClick = {
                if (nombre.isNotBlank() && contrasena.isNotBlank()){
                    viewModel.agregarUsuario(nombre, contrasena)
                    nombre = ""
                    contrasena = ""
                }
            }, modifier = Modifier.fillMaxWidth()
        ) {
            Text(text = "Agregar Usuario")
        }

        Spacer(modifier = Modifier.height(8.dp))

        Button(
            onClick = {
                scope.launch {
                    val usuario = viewModel.autenticar(nombre, contrasena)
                    if (usuario != null) {
                        mainViewModel.setCurrentUser(usuario)
                        navController.navigate(Screen.Profile.route)
                    } else {
                        // Sin manejo de error visual por ahora
                    }
                }
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(text = "Acceder")
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = { navController.popBackStack() },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(text = "Volver")
        }

        Spacer(modifier = Modifier.height(8.dp))

        Button(
            onClick = { navController.navigate(Screen.Home.route) },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(text = "Ir a Home")
        }

        Spacer(modifier = Modifier.height(8.dp))

        Button(
            onClick = { navController.navigate(Screen.Profile.route) },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(text = "Ir a Perfil")
        }
    }
}