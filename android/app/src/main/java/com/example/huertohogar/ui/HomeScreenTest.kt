package com.example.huertohogar.ui

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.navigation.compose.rememberNavController
import org.junit.Rule
import org.junit.Test

class HomeScreenTest {
    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun homeScreen_Titulo(){
        composeTestRule.setContent {
            HomeScreen(navController = rememberNavController())
        }
        composeTestRule.onNodeWithText("").assertIsDisplayed()
    }

    @Test
    fun homeScreen_Disponible(){
        composeTestRule.setContent {
            HomeScreen(navController = rememberNavController())
        }
        composeTestRule.onNodeWithText("Disponible").assertIsDisplayed()
    }
}