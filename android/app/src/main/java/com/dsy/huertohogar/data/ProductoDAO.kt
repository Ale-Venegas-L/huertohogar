package com.dsy.huertohogar.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import com.dsy.huertohogar.model.Producto

@Dao
interface ProductoDAO {
    @Insert
    suspend fun insertar(producto: Producto)

    @Query("SELECT * FROM producto")
    suspend fun obtenerTodos(): List<Producto>

    @Query("DELETE FROM producto")
    suspend fun limpiar()
}