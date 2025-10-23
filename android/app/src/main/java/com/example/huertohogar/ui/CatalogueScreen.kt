package com.example.huertohogar.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.huertohogar.navigation.Screen
import com.example.huertohogar.viewmodels.MainViewModel

@Composable
fun CatalogueScreen(
    navController: NavController,
    viewModel: MainViewModel
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(text = "Catalogo")
        Spacer(modifier = Modifier.height(24.dp))
        Button(
            onClick = {
                viewModel.navigateTo(Screen.Home)
            }
        ) {
            Text("Volver a Inicio")
        }
        Spacer(modifier = Modifier.height(24.dp))
        Button(
            onClick = {
                viewModel.navigateTo(Screen.Profile)
            }
        ) {
            Text("Ir a Perfil")
        }
    }
}