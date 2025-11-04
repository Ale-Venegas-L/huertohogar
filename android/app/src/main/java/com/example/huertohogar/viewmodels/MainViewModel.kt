package com.example.huertohogar.viewmodels

import androidx.lifecycle.ViewModel
import com.example.huertohogar.navigation.NavigationEvent
import com.example.huertohogar.navigation.Screen
import com.example.huertohogar.model.Usuario
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class MainViewModel: ViewModel() {
    private val _navigationEvents = MutableSharedFlow<NavigationEvent>()
    val navigationEvents: SharedFlow<NavigationEvent> = _navigationEvents.asSharedFlow()

    private val _currentUser = MutableStateFlow<Usuario?>(null)
    val currentUser: StateFlow<Usuario?> = _currentUser

    fun navigateTo(screen: Screen){
        CoroutineScope(Dispatchers.Main).launch {
            _navigationEvents.emit(NavigationEvent.NavigateTo(route = screen))
        }
    }

    fun navigateBack(){
        CoroutineScope(Dispatchers.Main).launch {
            _navigationEvents.emit(NavigationEvent.PopBackStack)
        }
    }

    fun navigateUp(){
        CoroutineScope(Dispatchers.Main).launch {
            _navigationEvents.emit(NavigationEvent.NavigateUp)
        }
    }

    fun setCurrentUser(user: Usuario?) {
        _currentUser.value = user
    }
}