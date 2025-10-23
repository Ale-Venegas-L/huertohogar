package com.example.huertohogar.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import com.example.huertohogar.model.Usuario

@Dao
interface UsuarioDAO {
    @Insert
    suspend fun insertar(usuario: Usuario)

    @Query("SELECT * FROM Usuario")
    suspend fun obtenerUsuario(): List<Usuario>
}