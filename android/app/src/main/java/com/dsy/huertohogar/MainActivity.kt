package com.dsy.huertohogar

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.dsy.huertohogar.navigation.NavigationEvent
import com.dsy.huertohogar.navigation.Screen
import com.dsy.huertohogar.ui.screen.ApiScreen
import com.dsy.huertohogar.ui.screen.CatalogueScreen
import com.dsy.huertohogar.ui.screen.HomeScreen
import com.dsy.huertohogar.ui.screen.LoginScreen
import com.dsy.huertohogar.ui.screen.ProfileScreen
import com.dsy.huertohogar.ui.screen.RegistroScreen
import com.dsy.huertohogar.ui.theme.HuertoHogarTheme
import com.dsy.huertohogar.viewmodel.CatalogueViewModel
import com.dsy.huertohogar.viewmodel.LoginViewModel
import com.dsy.huertohogar.viewmodel.MainViewModel
import com.dsy.huertohogar.viewmodel.PostViewModel
import com.dsy.huertohogar.viewmodel.RegistroViewModel
import kotlinx.coroutines.flow.collectLatest

// Create a composition local for the application instance
val LocalApplication = compositionLocalOf<HuertoHogarApplication> { error("No Application provided") }

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            val application = application as HuertoHogarApplication
            val mainViewModel: MainViewModel = viewModel(
                factory = object : ViewModelProvider.Factory {
                    override fun <T : ViewModel> create(modelClass: Class<T>): T {
                        @Suppress("UNCHECKED_CAST")
                        return MainViewModel() as T
                    }
                }
            )

            HuertoHogarTheme {
                CompositionLocalProvider(LocalApplication provides application) {
                    val navController = rememberNavController()
                    val currentUser by mainViewModel.currentUser.collectAsState()
                    val isLoggedIn = currentUser != null
                    val startDestination = if (isLoggedIn) Screen.Home.route else Screen.Login.route

                    // Handle navigation events
                    LaunchedEffect(Unit) {
                        mainViewModel.navigationEvents.collectLatest { event ->
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

                    Scaffold(
                        modifier = Modifier.fillMaxSize()
                    ) { innerPadding ->
                        NavHost(
                            navController = navController,
                            startDestination = startDestination,
                            modifier = Modifier.padding(innerPadding)
                        ) {
                            composable(route = Screen.Login.route) { backStackEntry ->
                                val loginViewModel: LoginViewModel = viewModel(
                                    factory = object : ViewModelProvider.Factory {
                                        @Suppress("UNCHECKED_CAST")
                                        override fun <T : ViewModel> create(modelClass: Class<T>): T {
                                            val db = application.database
                                            return LoginViewModel(db.usuarioDao()) as T
                                        }
                                    }
                                )

                                LoginScreen(
                                    navController = navController,
                                    viewModel = loginViewModel,
                                    mainViewModel = mainViewModel
                                )
                            }

                            composable(route = Screen.Registro.route) { backStackEntry ->
                                val registroViewModel: RegistroViewModel = viewModel(
                                    factory = object : ViewModelProvider.Factory {
                                        @Suppress("UNCHECKED_CAST")
                                        override fun <T : ViewModel> create(modelClass: Class<T>): T {
                                            val db = application.database
                                            return RegistroViewModel(db.usuarioDao()) as T
                                        }
                                    }
                                )

                                RegistroScreen(
                                    navController = navController,
                                    viewModel = registroViewModel,
                                    mainViewModel = mainViewModel
                                )
                            }

                            composable(route = Screen.Home.route) { backStackEntry ->
                                HomeScreen(
                                    onNavigateToLogin = {
                                        mainViewModel.setCurrentUser(null)
                                        navController.navigate(Screen.Login.route) {
                                            popUpTo(Screen.Home.route) { inclusive = true }
                                        }
                                    },
                                    onNavigateToRegister = {
                                        navController.navigate(Screen.Registro.route) {
                                            popUpTo(Screen.Home.route) { inclusive = true }
                                        }
                                    },
                                    mainViewModel = mainViewModel
                                )
                            }

                            composable(route = Screen.Profile.route) { backStackEntry ->
                                ProfileScreen(
                                    navController = navController,
                                    mainViewModel = mainViewModel
                                )
                            }

                            composable(route = Screen.Catalogue.route) { backStackEntry ->
                                val catalogueViewModel: CatalogueViewModel = viewModel(
                                    factory = object : ViewModelProvider.Factory {
                                        @Suppress("UNCHECKED_CAST")
                                        override fun <T : ViewModel> create(modelClass: Class<T>): T {
                                            val db = application.database
                                            return CatalogueViewModel(db.productoDao()) as T
                                        }
                                    }
                                )

                                CatalogueScreen(
                                    navController = navController,
                                    viewModel = catalogueViewModel,
                                    mainViewModel = mainViewModel
                                )
                            }
                            
                            composable(route = Screen.Api.route) {
                                val postViewModel: PostViewModel = viewModel(
                                    factory = object : ViewModelProvider.Factory {
                                        @Suppress("UNCHECKED_CAST")
                                        override fun <T : ViewModel> create(modelClass: Class<T>): T {
                                            return PostViewModel() as T
                                        }
                                    }
                                )
                                ApiScreen(viewModel = postViewModel)
                            }
                        }
                    }
                }
            }
        }
    }
}