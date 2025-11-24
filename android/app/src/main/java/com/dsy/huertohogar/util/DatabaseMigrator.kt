package com.dsy.huertohogar.util

import android.content.Context
import com.dsy.huertohogar.data.HuertoHogarDatabase
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream

object DatabaseMigrator {
    private const val ASSETS_IMAGES_DIR = "product_images"
    private const val INTERNAL_IMAGES_DIR = "product_images"
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

            val targetDir = File(context.filesDir, INTERNAL_IMAGES_DIR)
            if (!targetDir.exists()) {
                targetDir.mkdirs()
            }

            products.forEach { product ->
                if (product.imagenPath.isNullOrEmpty()) {
                    try {
                        val imageName = "${product.nombre.lowercase().replace(" ", "_")}.jpg"
                        val assetPath = "$ASSETS_IMAGES_DIR/$imageName"
                        
                        context.assets.open(assetPath).use { inputStream ->
                            val outputFile = File(targetDir, imageName)
                            FileOutputStream(outputFile).use { outputStream ->
                                inputStream.copyTo(outputStream)
                            }
                            
                            val updatedProduct = product.copy(
                                imagenPath = "$INTERNAL_IMAGES_DIR/$imageName"
                            )
                            productoDao.update(updatedProduct)
                        }
                    } catch (e: Exception) {
                        // Asset not found or other error - skip this product
                        e.printStackTrace()
                    }
                }
            }

            prefs.edit().putBoolean(MIGRATION_COMPLETE_KEY, true).apply()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}