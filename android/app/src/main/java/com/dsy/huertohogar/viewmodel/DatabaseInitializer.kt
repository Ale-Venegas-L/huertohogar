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
        Producto(nombre = "Manzanas Fuji", precio = 1200, stock = 150, descripcion = "Manzanas Fuji", imagenPath = "product_images/manzana.webp"),
        Producto(nombre = "Naranjas Valencia", precio = 1000, stock = 200, descripcion = "Naranjas Valencia", imagenPath = "product_images/naranja.webp"),
        Producto(nombre = "Plátanos Cavendish", precio = 800, stock = 250, descripcion = "Plátanos Cavendish", imagenPath = "product_images/platano.webp"),
        Producto(nombre = "Zanahorias Orgánicas", precio = 900, stock = 100, descripcion = "Zanahorias Orgánicas", imagenPath = "product_images/zanahoria.webp"),
        Producto(nombre = "Espinacas Frescas", precio = 700, stock = 80, descripcion = "Espinacas Frescas", imagenPath = "product_images/espinaca.webp"),
        Producto(nombre = "Pimientos Tricolores", precio = 1500, stock = 120, descripcion = "Pimientos Tricolores", imagenPath = "product_images/pimenton.webp"),
        Producto(nombre = "Miel Orgánica", precio = 1590, stock = 25, descripcion = "Miel Orgánica", imagenPath = "product_images/miel.webp")
    )

    private val sampleUsers = listOf(
        Usuario(nombre = "admin", passwd = "admin123"),
        Usuario(nombre = "usuario", passwd = "usuario123")
    )

    private fun copyImagesFromAssets(context: Context) {
        try {
            val files = context.assets.list("product_images")
            if (files != null) {
                val targetDir = File(context.filesDir, "product_images")
                if (!targetDir.exists()) {
                    targetDir.mkdirs()
                }
                
                files.forEach { filename ->
                    val inputStream = context.assets.open("product_images/$filename")
                    val outputFile = File(targetDir, filename)
                    FileOutputStream(outputFile).use { output ->
                        inputStream.copyTo(output)
                    }
                    inputStream.close()
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
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
