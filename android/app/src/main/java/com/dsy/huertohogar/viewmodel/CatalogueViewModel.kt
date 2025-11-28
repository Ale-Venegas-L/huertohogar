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

    fun agregarProducto(
        nombre: String,
        precio: Int,
        stock: Int,
        descripcion: String? = null,
        drawableName: String? = null
    ) {
        viewModelScope.launch {
            val nuevo = Producto(
                nombre = nombre,
                precio = precio,
                stock = stock,
                descripcion = descripcion,
                drawableName = drawableName
            )
            productoDAO.insertar(nuevo)
            cargarProductos() // Refresh the list
        }
    }

    fun actualizarProducto(producto: Producto) {
        viewModelScope.launch {
            productoDAO.update(producto)
            cargarProductos() // Refresh the list
        }
    }

    fun eliminarProducto(producto: Producto) {
        viewModelScope.launch {
            // If you have a delete method in your DAO, use it here
            // productoDAO.eliminar(producto)
            // For now, we'll just update the list
            cargarProductos()
        }
    }
}