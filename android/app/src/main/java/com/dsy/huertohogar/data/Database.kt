package com.dsy.huertohogar.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import com.dsy.huertohogar.model.Producto
import com.dsy.huertohogar.model.Usuario

@Database(entities = [Usuario::class, Producto::class], version = 5, exportSchema = false)
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

        // Migration from version 2 to 3: Recreate the table
        private val MIGRATION_2_3 = object : Migration(2, 3) {
            override fun migrate(database: SupportSQLiteDatabase) {
                // This will be handled by fallbackToDestructiveMigration
            }
        }

        // Migration from version 3 to 4: Add drawableName column
        private val MIGRATION_3_4 = object : Migration(3, 4) {
            override fun migrate(database: SupportSQLiteDatabase) {
                database.execSQL("ALTER TABLE producto ADD COLUMN drawableName TEXT")
            }
        }

        // Migration from version 4 to 5: Recreate the database to ensure clean state
        private val MIGRATION_4_5 = object : Migration(4, 5) {
            override fun migrate(database: SupportSQLiteDatabase) {
                // This will be handled by fallbackToDestructiveMigration
            }
        }

        fun getDatabase(context: Context): HuertoHogarDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    HuertoHogarDatabase::class.java,
                    "huerto_hogar_db"
                )
                .addMigrations(
                    MIGRATION_1_2,
                    MIGRATION_2_3,
                    MIGRATION_3_4,
                    MIGRATION_4_5
                )
                .fallbackToDestructiveMigration()  // This will handle any version conflicts
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}