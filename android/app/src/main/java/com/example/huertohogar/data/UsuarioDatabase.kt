package com.example.huertohogar.data

import androidx.room.RoomDatabase

abstract class UsuarioDatabase : RoomDatabase() {
    abstract fun usuarioDao(): UsuarioDAO
}