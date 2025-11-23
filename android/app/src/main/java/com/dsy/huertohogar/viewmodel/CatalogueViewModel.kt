package com.dsy.huertohogar.viewmodel

import com.dsy.huertohogar.data.ProductoDAO
import com.dsy.huertohogar.model.Producto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope

class CatalogueViewModel(private val productoDAO: ProductoDAO) : ViewModel() {
    private val _productos = MutableStateFlow<List<Producto>>(emptyList())
    val productos = _productos.asStateFlow()

    fun cargarProductos() {
        viewModelScope.launch {
            _productos.value = productoDAO.obtenerTodos()
        }
    }

    fun agregarProducto(nombre: String, precio: Int, stock: Int, descripcion: String? = null) {
        val nuevo = Producto(nombre = nombre, precio = precio, stock = stock, descripcion = descripcion)
        viewModelScope.launch {
            productoDAO.insertar(nuevo)
            _productos.value = productoDAO.obtenerTodos()
        }
    }
}