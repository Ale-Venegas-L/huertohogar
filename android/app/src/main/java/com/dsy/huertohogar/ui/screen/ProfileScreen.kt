package com.dsy.huertohogar.ui.screen

import androidx.compose.runtime.Composable
import androidx.navigation.NavController
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier

import androidx.lifecycle.viewmodel.compose.viewModel
import com.dsy.huertohogar.navigation.Screen
import com.dsy.huertohogar.viewmodel.MainViewModel


@Composable
fun ProfileScreen(
    navController: NavController,
    viewModel: MainViewModel = viewModel()
){
    val items = listOf(Screen.Home, Screen.Profile)
    var selectedItem by remember{ mutableStateOf(1) }
    val currentUser by viewModel.currentUser.collectAsState()

    Scaffold(
        bottomBar = {
            NavigationBar {
                items.forEachIndexed { index, screen ->
                    NavigationBarItem(
                        selected = selectedItem == index,
                        onClick = {
                            selectedItem=index
                            navController.navigate(screen.route) {
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        label = { Text(screen.route) },
                        icon = {
                            Icon(
                                imageVector = if (screen == Screen.Home) Icons.Default.Home else Icons.Default.Person,
                                contentDescription = screen.route
                            )
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        Column(modifier = Modifier
            .padding(innerPadding)
            .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            val saludo = currentUser?.let { "Bienvenido, ${it.nombre}" } ?: "Bienvenido al perfil"
            Text(saludo)
        }
    }
}