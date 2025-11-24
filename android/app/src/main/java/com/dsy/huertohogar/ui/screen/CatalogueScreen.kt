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
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import com.dsy.huertohogar.navigation.Screen
import com.dsy.huertohogar.ui.components.Boton
import com.dsy.huertohogar.ui.components.EspaciadorDoble
import com.dsy.huertohogar.ui.components.ProductCard
import com.dsy.huertohogar.viewmodel.CatalogueViewModel
import com.dsy.huertohogar.viewmodel.MainViewModel

@Composable
fun CatalogueScreen(
    navController: NavController,
    viewModel: CatalogueViewModel,
    mainViewModel: MainViewModel
) {
    val productos by viewModel.productos.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.cargarProductos()
    }

    val context = LocalContext.current
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Catálogo de Productos",
            style = MaterialTheme.typography.headlineSmall,
            modifier = Modifier.padding(bottom = 16.dp)
        )
        
        LazyColumn(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(productos) { producto ->
                ProductCard(producto = producto, context = context)
            }
        }
        EspaciadorDoble()
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            Boton(
                texto = "Volver a Inicio",
                onClick = {
                    navController.navigate(Screen.Home.route) {
                        launchSingleTop = true
                        restoreState = true
                    }
                }
            )
            Boton(
                texto = "Ir a Perfil",
                onClick = {
                    navController.navigate(Screen.Profile.route) {
                        launchSingleTop = true
                        restoreState = true
                    }
                }
            )
        }
    }
}
