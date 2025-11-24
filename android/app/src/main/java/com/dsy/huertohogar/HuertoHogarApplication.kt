package com.dsy.huertohogar

import android.app.Application
import com.dsy.huertohogar.data.HuertoHogarDatabase
import com.dsy.huertohogar.util.DatabaseMigrator
import com.dsy.huertohogar.viewmodel.DatabaseInitializer
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class HuertoHogarApplication : Application() {
    private var _database: HuertoHogarDatabase? = null
    
    val database: HuertoHogarDatabase
        get() = _database ?: synchronized(this) {
            _database ?: HuertoHogarDatabase.getDatabase(this).also { db ->
                _database = db
                // Initialize with sample data
                DatabaseInitializer.initializeDatabase(this)
                // Run database migration
                CoroutineScope(Dispatchers.IO).launch {
                    DatabaseMigrator.migrateIfNeeded(this@HuertoHogarApplication, db)
                }
            }
        }

    override fun onCreate() {
        super.onCreate()
        // Initialize database when app starts
        database
    }
}
