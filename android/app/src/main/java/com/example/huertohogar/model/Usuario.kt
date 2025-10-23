package com.example.huertohogar.model

import androidx.room.Entity
import androidx.room.PrimaryKey


@Entity(tableName = "Usuario")
data class Usuario (
    @PrimaryKey(autoGenerate = true)
    val id:Int,
    val nombre:String,
    val contrasena:String
)

