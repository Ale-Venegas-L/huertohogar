package com.example.huertohogar.navigation

sealed class Screen(val route:String){
    data object Home : Screen("home_page")
    data object Profile : Screen("profile_page")
    data object Catalogue : Screen("catalogue_page")
}