package com.dsy.huertohogar.ui

import androidx.compose.ui.test.junit4.createComposeRule
import com.dsy.huertohogar.data.UsuarioDAO
import com.dsy.huertohogar.viewmodel.LoginViewModel
import com.dsy.huertohogar.viewmodel.MainViewModel
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Before
import org.junit.Rule
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class LoginScreenTest {
    private val testDispatcher = StandardTestDispatcher()

    @get:Rule
    val composeTestRule = createComposeRule()

    private lateinit var mockUsuarioDao: UsuarioDAO
    private lateinit var loginViewModel: LoginViewModel
    private lateinit var mainViewModel: MainViewModel

    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        mockUsuarioDao = mockk(relaxed = true) {
            coEvery { buscarUsuario(any(), any()) } returns null
        }
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun loginScreen_enterCredentials() = runTest {
        val testUser = "testuser"
        val testPassword = "password123"
        coEvery { loginViewModel.autenticar(testUser, testPassword) } returns null
    }
}
