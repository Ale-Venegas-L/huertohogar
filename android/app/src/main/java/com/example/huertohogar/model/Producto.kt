package com.example.huertohogar.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "producto")
data class Producto(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val nombre: String,
    val precio: Int,
    val stock: Int,
    val descripcion: String? = null
)