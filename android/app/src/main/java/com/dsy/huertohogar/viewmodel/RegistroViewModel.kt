package com.dsy.huertohogar.viewmodel

import androidx.lifecycle.ViewModel
import com.dsy.huertohogar.data.UsuarioDAO
import com.dsy.huertohogar.model.Usuario


class RegistroViewModel(private val usuarioDAO: UsuarioDAO) : ViewModel() {
    suspend fun registrarUsuario(nombre: String, contrasena: String) {
        val usuario = Usuario(
            nombre = nombre,
            passwd = contrasena
        )
        usuarioDAO.insertar(usuario)
    }}