package com.example.huertohogar.navigation

sealed class Screen(val route:String){
    data object Home : Screen("Home")
    data object Profile : Screen("Perfil")
    data object Catalogue : Screen("Catalogo")
    data object Form : Screen("Formulario")
}