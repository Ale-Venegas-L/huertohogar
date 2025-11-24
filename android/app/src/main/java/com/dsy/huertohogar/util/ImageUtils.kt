package com.dsy.huertohogar.util

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import java.util.UUID

object ImageUtils {
    
    private const val PRODUCT_IMAGES_DIR = "product_images"
    
    suspend fun saveProductImage(
        context: Context,
        imageUri: Uri,
        productName: String
    ): String = withContext(Dispatchers.IO) {
        // Create the directory if it doesn't exist
        val productImagesDir = File(context.filesDir, PRODUCT_IMAGES_DIR)
        if (!productImagesDir.exists()) {
            productImagesDir.mkdirs()
        }
        
        // Generate a unique filename
        val extension = context.contentResolver.getType(imageUri)?.split("/")?.last() ?: "jpg"
        val filename = "${productName.lowercase().replace(" ", "_")}_${UUID.randomUUID()}.$extension"
        val outputFile = File(productImagesDir, filename)
        
        // Copy the image
        context.contentResolver.openInputStream(imageUri)?.use { input ->
            FileOutputStream(outputFile).use { output ->
                input.copyTo(output)
            }
        }
        
        // Return the relative path
        "$PRODUCT_IMAGES_DIR/$filename"
    }
    
    fun getProductImageBitmap(context: Context, imagePath: String?): Bitmap? {
        if (imagePath.isNullOrEmpty()) return null
        
        return try {
            val imageFile = File(context.filesDir, imagePath)
            if (imageFile.exists()) {
                BitmapFactory.decodeFile(imageFile.absolutePath)
            } else {
                null
            }
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
    
    fun deleteProductImage(context: Context, imagePath: String?): Boolean {
        if (imagePath.isNullOrEmpty()) return false
        
        return try {
            val imageFile = File(context.filesDir, imagePath)
            if (imageFile.exists()) {
                imageFile.delete()
            } else {
                false
            }
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
}
