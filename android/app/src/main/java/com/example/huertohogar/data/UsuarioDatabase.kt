package com.example.huertohogar.data

import androidx.room.Database
import androidx.room.RoomDatabase
import com.example.huertohogar.model.Usuario
import com.example.huertohogar.model.Producto

@Database(entities = [Usuario::class, Producto::class], version = 2)
abstract class UsuarioDatabase : RoomDatabase() {
    abstract fun usuarioDao(): UsuarioDAO
    abstract fun productoDao(): ProductoDAO
}