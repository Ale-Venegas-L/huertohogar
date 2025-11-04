package com.example.huertohogar.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.huertohogar.data.UsuarioDAO
import com.example.huertohogar.model.Usuario
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class FormularioViewModel(private val usuarioDAO: UsuarioDAO) : ViewModel() {
    private val _usuarios = MutableStateFlow<List<Usuario>>(emptyList())

    val usuarios = _usuarios.asStateFlow()

    fun agregarUsuario(nombre: String, contrasena: String){
        val nuevoUsuario = Usuario(nombre = nombre, contrasena = contrasena)
        viewModelScope.launch {
            usuarioDAO.insertar(nuevoUsuario)
            _usuarios.value = usuarioDAO.obtenerUsuario()
        }
    }

    fun cargarUsuarios(){
        viewModelScope.launch {
            _usuarios.value = usuarioDAO.obtenerUsuario()
        }
    }

    suspend fun autenticar(nombre: String, contrasena: String): Usuario? {
        return usuarioDAO.obtenerPorCredenciales(nombre, contrasena)
    }
}