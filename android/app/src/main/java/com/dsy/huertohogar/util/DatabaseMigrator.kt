package com.dsy.huertohogar.util

import android.content.Context
import com.dsy.huertohogar.data.HuertoHogarDatabase
import com.dsy.huertohogar.model.Producto
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

object DatabaseMigrator {
    private const val MIGRATION_PREFS = "database_migration_prefs"
    private const val MIGRATION_COMPLETE_KEY = "migration_v1_to_v2_complete"

    suspend fun migrateIfNeeded(context: Context, database: HuertoHogarDatabase) = withContext(Dispatchers.IO) {
        val prefs = context.getSharedPreferences(MIGRATION_PREFS, Context.MODE_PRIVATE)
        
        if (prefs.getBoolean(MIGRATION_COMPLETE_KEY, false)) {
            return@withContext
        }

        try {
            val productoDao = database.productoDao()
            val products = productoDao.getAllProducts()

            // For each product, set the drawable name based on product name
            products.forEach { product ->
                if (product.drawableName.isNullOrEmpty()) {
                    val drawableName = when (product.nombre.lowercase()) {
                        "manzanas fuji" -> "manzana"
                        "naranjas valencia" -> "naranja"
                        "plátanos cavendish" -> "platano"
                        "zanahorias orgánicas" -> "zanahoria"
                        "espinacas frescas" -> "espinaca"
                        "pimientos tricolores" -> "pimenton"
                        "miel orgánica" -> "miel"
                        else -> null
                    }
                    
                    drawableName?.let {
                        val updatedProduct = product.copy(drawableName = it)
                        productoDao.update(updatedProduct)
                    }
                }
            }

            prefs.edit().putBoolean(MIGRATION_COMPLETE_KEY, true).apply()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}