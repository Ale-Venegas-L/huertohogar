package com.dsy.huertohogar.data

import androidx.room.Database
import androidx.room.RoomDatabase
import com.dsy.huertohogar.model.Producto
import com.dsy.huertohogar.model.Usuario

@Database(entities = [Usuario::class, Producto::class], version = 2)
abstract class Database: RoomDatabase() {
    abstract fun usuarioDao(): UsuarioDAO
    abstract fun productoDao(): ProductoDAO
}