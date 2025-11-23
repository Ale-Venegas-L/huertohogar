package com.dsy.huertohogar.viewmodel

import androidx.lifecycle.ViewModel
import com.dsy.huertohogar.data.UsuarioDAO
import com.dsy.huertohogar.model.Usuario

class LoginViewModel(private val usuarioDAO: UsuarioDAO) : ViewModel() {
    suspend fun autenticar(nombre: String, contrasena: String): Usuario? {
        return usuarioDAO.buscarUsuario(nombre, contrasena)
    }
}
