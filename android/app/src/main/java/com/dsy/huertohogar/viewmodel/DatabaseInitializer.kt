package com.dsy.huertohogar.viewmodel

import android.content.Context
import com.dsy.huertohogar.HuertoHogarApplication
import com.dsy.huertohogar.model.Producto
import com.dsy.huertohogar.model.Usuario
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileOutputStream

object DatabaseInitializer {
    private val sampleProducts = listOf(
        Producto(nombre = "Manzanas Fuji", precio = 1200, stock = 150, descripcion = "Manzanas Fuji", drawableName = "manzana"),
        Producto(nombre = "Naranjas Valencia", precio = 1000, stock = 200, descripcion = "Naranjas Valencia", drawableName = "naranja"),
        Producto(nombre = "Plátanos Cavendish", precio = 800, stock = 250, descripcion = "Plátanos Cavendish", drawableName = "platano"),
        Producto(nombre = "Zanahorias Orgánicas", precio = 900, stock = 100, descripcion = "Zanahorias Orgánicas", drawableName = "zanahoria"),
        Producto(nombre = "Espinacas Frescas", precio = 700, stock = 80, descripcion = "Espinacas Frescas", drawableName = "espinaca"),
        Producto(nombre = "Pimientos Tricolores", precio = 1500, stock = 120, descripcion = "Pimientos Tricolores", drawableName = "pimenton"),
        Producto(nombre = "Miel Orgánica", precio = 1590, stock = 25, descripcion = "Miel Orgánica", drawableName = "miel")
    )

    private val sampleUsers = listOf(
        Usuario(nombre = "admin", passwd = "admin123"),
        Usuario(nombre = "usuario", passwd = "usuario123")
    )

    private fun copyImagesFromAssets(context: Context) {
        // No need to copy images anymore as we're using drawable resources
    }

    fun initializeDatabase(application: HuertoHogarApplication) {
        val database = application.database
        val productoDao = database.productoDao()
        val usuarioDao = database.usuarioDao()

        CoroutineScope(Dispatchers.IO).launch {
            // Copy images from assets to internal storage
            copyImagesFromAssets(application.applicationContext)
            
            // Clear and reinsert products
            productoDao.limpiar()
            sampleProducts.forEach { productoDao.insertar(it) }

            // Insert users if they don't exist
            sampleUsers.forEach { user ->
                if (usuarioDao.buscarUsuario(user.nombre, user.passwd) == null) {
                    usuarioDao.insertar(user)
                }
            }
        }
    }
}
