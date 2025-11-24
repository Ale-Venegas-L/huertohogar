package com.dsy.huertohogar.ui

import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.navigation.compose.rememberNavController
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.dsy.huertohogar.MainActivity
import com.dsy.huertohogar.navigation.Screen
import com.dsy.huertohogar.ui.screen.HomeScreen
import com.dsy.huertohogar.ui.theme.HuertoHogarTheme
import com.dsy.huertohogar.viewmodel.MainViewModel
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class HuertoHogarUITest {

    @get:Rule
    val composeTestRule = createAndroidComposeRule<MainActivity>()

    @Before
    fun setUp() {
        composeTestRule.setContent {
            HuertoHogarTheme {
                val navController = rememberNavController()
                val viewModel = MainViewModel()
                
                // Set up your navigation graph here
                HomeScreen(
                    onNavigateToLogin = { /* Handle navigation */ },
                    onNavigateToRegister = { /* Handle navigation */ },
                    mainViewModel = viewModel
                )
            }
        }
    }

    @Test
    fun homeScreen_verifyInitialState() {
        // Verify the presence of main elements
        composeTestRule.onNodeWithText("Bienvenido a Huerto Hogar").assertIsDisplayed()
        composeTestRule.onNodeWithText("Iniciar Sesión").assertIsDisplayed()
        composeTestRule.onNodeWithText("Registrarse").assertIsDisplayed()
    }

    @Test
    fun homeScreen_navigateToLogin() {
        // Click on login button
        composeTestRule.onNodeWithText("Iniciar Sesión").performClick()
        
        // Verify navigation to login screen
        // Note: You'll need to update this based on your actual navigation implementation
        composeTestRule.onNodeWithContentDescription("Login Screen").assertIsDisplayed()
    }

    @Test
    fun homeScreen_navigateToRegister() {
        // Click on register button
        composeTestRule.onNodeWithText("Registrarse").performClick()
        
        // Verify navigation to register screen
        // Note: You'll need to update this based on your actual navigation implementation
        composeTestRule.onNodeWithContentDescription("Register Screen").assertIsDisplayed()
    }
}
