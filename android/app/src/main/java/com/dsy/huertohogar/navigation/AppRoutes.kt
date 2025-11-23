package com.dsy.huertohogar.navigation
sealed class Screen(val route: String) {
    data object Login : Screen("login")
    data object Registro : Screen("registro")
    data object Home : Screen("home")
    data object Profile : Screen("perfil")
    data object Catalogue : Screen("catalogo")

}