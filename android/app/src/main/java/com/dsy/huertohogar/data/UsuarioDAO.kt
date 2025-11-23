package com.dsy.huertohogar.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import com.dsy.huertohogar.model.Usuario
import kotlinx.coroutines.flow.Flow

@Dao
interface UsuarioDAO {
    @Insert
    suspend fun insertar(usuario: Usuario)

    @Query("SELECT * FROM usuarios")
    fun obtenerTodos(): Flow<List<Usuario>>

    @Query("SELECT * FROM usuarios WHERE nombre = :nombre AND passwd= :passwd LIMIT 1")
    suspend fun buscarUsuario(nombre: String, passwd: String): Usuario?
}