package com.example.huertohogar.ui

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel

@Composable
fun Formulario(viewModel: ViewModel){
    var nombre by remember { mutableStateOf("") }
    var contrasena by remember { mutableStateOf("") }

    val usuarios by viewModel.usuarios.collectAsState()
}