package com.dsy.huertohogar

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.room.Room
import com.dsy.huertohogar.data.Database
import com.dsy.huertohogar.model.Producto
import com.dsy.huertohogar.navigation.NavigationEvent
import com.dsy.huertohogar.navigation.Screen
import com.dsy.huertohogar.ui.screen.CatalogueScreen
import com.dsy.huertohogar.ui.screen.HomeScreen
import com.dsy.huertohogar.ui.screen.LoginScreen
import com.dsy.huertohogar.ui.screen.ProfileScreen
import com.dsy.huertohogar.ui.screen.RegistroScreen
import com.dsy.huertohogar.ui.theme.HuertoHogarTheme
import com.dsy.huertohogar.viewmodel.CatalogueViewModel
import com.dsy.huertohogar.viewmodel.RegistroViewModel
import com.dsy.huertohogar.viewmodel.LoginViewModel
import com.dsy.huertohogar.viewmodel.MainViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.collectLatest
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
                //login check:
                val isLoggedIn = viewModel.currentUser.value != null
                val startDestination = if (isLoggedIn) Screen.Home.route else Screen.Login.route

                Scaffold(
                    modifier = Modifier.fillMaxSize()
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = startDestination,
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable(route = Screen.Login.route) { backStackEntry ->
                            val context = LocalContext.current
                            val db = Room.databaseBuilder(
                                context,
                                Database::class.java,
                                "huerto_hogar_db"
                            )
                                .fallbackToDestructiveMigration()
                                .build()
                            val usuarioDAO = db.usuarioDao()

                            val loginViewModel: LoginViewModel = viewModel(
                                factory = object : ViewModelProvider.Factory {
                                    @Suppress("UNCHECKED_CAST")
                                    override fun <T : ViewModel> create(modelClass: Class<T>): T {
                                        return LoginViewModel(usuarioDAO) as T
                                    }
                                }
                            )

                            LoginScreen(
                                navController = navController,
                                viewModel = loginViewModel
                            )
                        }

                        composable(route = Screen.Registro.route) { backStackEntry ->
                            val context = LocalContext.current
                            val db = Room.databaseBuilder(
                                context,
                                Database::class.java,
                                "huerto_hogar_db"
                            )
                                .fallbackToDestructiveMigration()
                                .build()
                            val usuarioDAO = db.usuarioDao()

                            val registroViewModel: RegistroViewModel = viewModel(
                                factory = object : ViewModelProvider.Factory {
                                    @Suppress("UNCHECKED_CAST")
                                    override fun <T : ViewModel> create(modelClass: Class<T>): T {
                                        return RegistroViewModel(usuarioDAO) as T
                                    }
                                }
                            )

                            RegistroScreen(
                                navController = navController,
                                viewModel = registroViewModel
                            )
                        }

                        composable(route = Screen.Home.route) { backStackEntry ->
                            HomeScreen(
                                navController = navController,
                                mainViewModel = viewModel
                            )
                        }
                        composable(route = Screen.Profile.route) { backStackEntry ->
                            ProfileScreen(
                                navController = navController,
                                viewModel = viewModel
                            )
                        }

                        composable(route = Screen.Catalogue.route) { backStackEntry ->
                            val context = LocalContext.current
                            val db = Room.databaseBuilder(
                                context,
                                Database::class.java,
                                "huerto_hogar_db"
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
                                            Producto(nombre = "Naranjas Valencia", precio = 1000, stock = 200, descripcion = "Naranjas Valencia"),
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
                    }
                }
            }
        }
    }
}