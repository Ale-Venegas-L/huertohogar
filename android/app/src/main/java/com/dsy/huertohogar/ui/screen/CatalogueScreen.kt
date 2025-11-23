package com.dsy.huertohogar.ui.screen

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Divider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.dsy.huertohogar.viewmodel.CatalogueViewModel
import com.dsy.huertohogar.viewmodel.MainViewModel
import com.dsy.huertohogar.navigation.Screen

@Composable
fun CatalogueScreen(
    navController: NavController,
    viewModel: MainViewModel,
    catalogueViewModel: CatalogueViewModel
) {
    val productos by catalogueViewModel.productos.collectAsState()

    LaunchedEffect(Unit) {
        catalogueViewModel.cargarProductos()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(text = "Catalogo")
        Spacer(modifier = Modifier.height(24.dp))
        // Encabezado de tabla
        Row(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
            Text("Nombre", modifier = Modifier.weight(2f))
            Text("Precio", modifier = Modifier.weight(1f))
            Text("Stock", modifier = Modifier.weight(1f))
        }
        Divider()
        LazyColumn(modifier = Modifier.fillMaxWidth().weight(1f, fill = true)) {
            items(productos) { p ->
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
                    Text(p.nombre, modifier = Modifier.weight(2f))
                    Text("$${p.precio}", modifier = Modifier.weight(1f))
                    Text(p.stock.toString(), modifier = Modifier.weight(1f))
                }
                Divider()
            }
        }
        Spacer(modifier = Modifier.height(24.dp))
        Button(
            onClick = {
                navController.navigate(Screen.Home.route) {
                    launchSingleTop = true
                    restoreState = true
                }
            }
        ) {
            Text("Volver a Inicio")
        }
        Spacer(modifier = Modifier.height(24.dp))
        Button(
            onClick = {
                navController.navigate(Screen.Profile.route) {
                    launchSingleTop = true
                    restoreState = true
                }
            }
        ) {
            Text("Ir a Perfil")
        }
    }
}