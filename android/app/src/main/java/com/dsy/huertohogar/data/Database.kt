package com.dsy.huertohogar.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import com.dsy.huertohogar.model.Producto
import com.dsy.huertohogar.model.Usuario

@Database(entities = [Usuario::class, Producto::class], version = 3, exportSchema = false)
abstract class HuertoHogarDatabase : RoomDatabase() {
    abstract fun usuarioDao(): UsuarioDAO
    abstract fun productoDao(): ProductoDAO

    companion object {
        @Volatile
        private var INSTANCE: HuertoHogarDatabase? = null

        // Migration from version 1 to 2: Add imagenPath column to Producto
        private val MIGRATION_1_2 = object : Migration(1, 2) {
            override fun migrate(database: SupportSQLiteDatabase) {
                database.execSQL("ALTER TABLE producto ADD COLUMN imagenPath TEXT")
            }
        }

        // Migration from version 2 to 3: Recreate the table to ensure proper schema
        private val MIGRATION_2_3 = object : Migration(2, 3) {
            override fun migrate(database: SupportSQLiteDatabase) {
                // This migration will be handled by Room's fallbackToDestructiveMigration()
                // as we want to recreate the database with the new schema
            }
        }

        fun getDatabase(context: Context): HuertoHogarDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    HuertoHogarDatabase::class.java,
                    "huerto_hogar_db"
                )
                    .addMigrations(MIGRATION_1_2, MIGRATION_2_3)
                    .fallbackToDestructiveMigration()  // This will handle the schema recreation
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}