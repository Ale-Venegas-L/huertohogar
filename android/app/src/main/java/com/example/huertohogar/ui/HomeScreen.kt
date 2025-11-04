package com.example.huertohogar.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material3.Button
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.NavigationDrawerItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.huertohogar.navigation.Screen
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    navController: NavController
) {
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            ModalDrawerSheet {
                Text("Menú", modifier = Modifier.padding(16.dp))
                NavigationDrawerItem(
                    label = {Text("Ir a Perfil")},
                    selected = false,
                    onClick = {
                        // Close drawer and then navigate
                        scope.launch {
                            drawerState.close()
                            navController.navigate(Screen.Profile.route) {
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    }
                )
                NavigationDrawerItem(
                    label = { Text("Ir a Catálogo") },
                    selected = false,
                    onClick = {
                        scope.launch {
                            drawerState.close()
                            navController.navigate(Screen.Catalogue.route) {
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    }
                )
            }
        }
    ) {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = {Text("Pantalla Home")},
                    navigationIcon = {
                        IconButton(onClick = {
                            scope.launch { drawerState.open() }
                        }) {
                            Icon(Icons.Default.Menu, contentDescription = "Menú")
                        }
                    }
                )
            }
        ){
            innerPadding ->
            Column(
                modifier = Modifier
                    .padding(innerPadding)
                    .fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text("Bienvenido a la página de Inicio")
                Spacer(modifier = Modifier.height(16.dp))
                Button(onClick = {
                    navController.navigate(Screen.Profile.route) {
                        launchSingleTop = true
                        restoreState = true
                    }
                }) {
                    Text("Ir a perfil")
                }
                Spacer(modifier = Modifier.height(16.dp))

                Button(onClick = {
                    navController.navigate(Screen.Form.route) {
                        launchSingleTop = true
                        restoreState = true
                    }
                }) {
                    Text("Ir a formulario")
                }
                Spacer(modifier = Modifier.height(16.dp))

                Button(onClick = {
                    navController.navigate(Screen.Catalogue.route) {
                        launchSingleTop = true
                        restoreState = true
                    }
                }) {
                    Text("Ir a catalogo")
                }
            }
        }

    }
}