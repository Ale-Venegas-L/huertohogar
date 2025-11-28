package com.dsy.huertohogar.util

import android.content.Context
import android.graphics.Bitmap
import androidx.annotation.DrawableRes
import androidx.core.content.ContextCompat

object ImageUtils {
    
    /**
     * Get a drawable resource ID by its name
     */
    @DrawableRes
    fun getDrawableResourceId(context: Context, drawableName: String?): Int {
        if (drawableName.isNullOrEmpty()) return 0
        return context.resources.getIdentifier(
            drawableName,
            "drawable",
            context.packageName
        )
    }
    
    /**
     * Get a Bitmap from a drawable resource
     */
    fun getDrawableBitmap(context: Context, @DrawableRes drawableResId: Int): Bitmap? {
        if (drawableResId == 0) return null
        return try {
            ContextCompat.getDrawable(context, drawableResId)?.let { drawable ->
                val width = if (drawable.intrinsicWidth > 0) drawable.intrinsicWidth else 100
                val height = if (drawable.intrinsicHeight > 0) drawable.intrinsicHeight else 100
                val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
                val canvas = android.graphics.Canvas(bitmap)
                drawable.setBounds(0, 0, canvas.width, canvas.height)
                drawable.draw(canvas)
                bitmap
            }
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
    
    /**
     * Get a Bitmap from a drawable resource name
     */
    fun getBitmapFromDrawableName(context: Context, drawableName: String?): Bitmap? {
        if (drawableName.isNullOrEmpty()) return null

        val primaryId = getDrawableResourceId(context, drawableName)
        if (primaryId != 0) {
            return getDrawableBitmap(context, primaryId)
        }

        val possibleNames = listOf(
            drawableName,
            "${drawableName}_small",
            "${drawableName}_medium",
            "${drawableName}_large",
            "ic_${drawableName}",
            "img_${drawableName}"
        )

        for (name in possibleNames) {
            val id = getDrawableResourceId(context, name)
            if (id != 0) {
                getDrawableBitmap(context, id)?.let { return it }
            }
        }

        return null
    }
}
