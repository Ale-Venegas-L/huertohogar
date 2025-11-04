package com.example.huertohogar

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.room.Room
import com.example.huertohogar.navigation.NavigationEvent
import com.example.huertohogar.navigation.Screen
import com.example.huertohogar.data.UsuarioDatabase
import com.example.huertohogar.model.Producto
import com.example.huertohogar.ui.CatalogueScreen
import com.example.huertohogar.ui.Formulario
import com.example.huertohogar.ui.HomeScreen
import com.example.huertohogar.ui.ProfileScreen
import com.example.huertohogar.ui.theme.HuertoHogarTheme
import com.example.huertohogar.viewmodels.CatalogueViewModel
import com.example.huertohogar.viewmodels.FormularioViewModel
import com.example.huertohogar.viewmodels.MainViewModel
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            HuertoHogarTheme {
                val viewModel: MainViewModel = viewModel()
                val navController = rememberNavController()

                LaunchedEffect(key1 = Unit) {
                    viewModel.navigationEvents.collectLatest { event ->
                        when (event) {
                            is NavigationEvent.NavigateTo -> {
                                navController.navigate(event.route.route) {
                                    event.popUpToRoute?.let {
                                        popUpTo(it.route) {
                                            inclusive = event.inclusive
                                        }
                                    }
                                    launchSingleTop = event.singleTop
                                    restoreState = true
                                }
                            }

                            is NavigationEvent.PopBackStack -> navController.popBackStack()
                            is NavigationEvent.NavigateUp -> navController.navigateUp()
                        }
                    }
                }
                // layout
                Scaffold(
                    modifier = Modifier.fillMaxSize()
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = Screen.Home.route,
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable(route = Screen.Home.route) {
                            HomeScreen(navController = navController)
                        }
                        composable(route = Screen.Profile.route) {
                            ProfileScreen(navController = navController, viewModel = viewModel)
                        }
                        composable(route = Screen.Catalogue.route) {
                            val context = LocalContext.current
                            val db = Room.databaseBuilder(
                                context,
                                UsuarioDatabase::class.java,
                                "usuarios.db"
                            )
                                .fallbackToDestructiveMigration()
                                .build()
                            val productoDAO = db.productoDao()

                            LaunchedEffect(Unit) {
                                withContext(Dispatchers.IO) {
                                    if (productoDAO.obtenerTodos().isEmpty()) {
                                        val seed = listOf(
                                            Producto(
                                                nombre = "Manzana Fuji",
                                                precio = 1200,
                                                stock = 150,
                                                descripcion = "FR001 - Manzanas Fuji"
                                            ),
                                            Producto(nombre = "Naranjas Valencia", precio = 1000, stock = 200, descripcion = "FR001 - Manzanas Fuji"),
                                            Producto(nombre = "Plátanos Cavendish", precio = 800, stock = 250, descripcion = "Plátanos Cavendish"),
                                            Producto(nombre = "Zanahorias Orgánicas", precio = 900, stock = 100, descripcion = "Zanahorias Orgánicas"),
                                            Producto(nombre = "Espinacas Frescas", precio = 700, stock = 80, descripcion = "Espinacas Frescas"),
                                            Producto(nombre = "Pimientos Tricolores", precio = 1500, stock = 120, descripcion = "Pimientos Tricolores"),
                                            Producto(nombre = "Miel Orgánica", precio = 5000, stock = 50, descripcion = "Miel Orgánica")
                                        )
                                        seed.forEach { productoDAO.insertar(it) }
                                    }
                                }
                            }

                            val catalogueViewModel: CatalogueViewModel = viewModel(
                                factory = object : ViewModelProvider.Factory {
                                    @Suppress("UNCHECKED_CAST")
                                    override fun <T : ViewModel> create(modelClass: Class<T>): T {
                                        return CatalogueViewModel(productoDAO) as T
                                    }
                                }
                            )

                            CatalogueScreen(
                                navController = navController,
                                viewModel = viewModel,
                                catalogueViewModel = catalogueViewModel
                            )
                        }
                        composable(route = Screen.Form.route) {
                            val context = LocalContext.current
                            val db = Room.databaseBuilder(
                                context,
                                UsuarioDatabase::class.java,
                                "usuarios.db"
                            )
                                .fallbackToDestructiveMigration()
                                .build()
                            val usuarioDAO = db.usuarioDao()

                            val formularioViewModel: FormularioViewModel = viewModel(
                                factory = object : ViewModelProvider.Factory {
                                    @Suppress("UNCHECKED_CAST")
                                    override fun <T : ViewModel> create(modelClass: Class<T>): T {
                                        return FormularioViewModel(usuarioDAO) as T
                                    }
                                }
                            )

                            Formulario(navController = navController, viewModel = formularioViewModel, mainViewModel = viewModel)
                        }
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    HuertoHogarTheme {

    }
}
