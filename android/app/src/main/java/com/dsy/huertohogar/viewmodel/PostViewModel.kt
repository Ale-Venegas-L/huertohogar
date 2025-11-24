package com.dsy.huertohogar.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dsy.huertohogar.data.remote.RetrofitInstance
import com.dsy.huertohogar.model.Post
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

// Sealed class for state management
sealed class PostState {
    data object Loading : PostState()
    data class Success(val posts: List<Post>) : PostState()
    data class Error(val message: String) : PostState()
}

class PostViewModel : ViewModel() {
    private val _postState = MutableStateFlow<PostState>(PostState.Loading)
    val postState: StateFlow<PostState> = _postState.asStateFlow()

    private val _isLoadingMore = MutableStateFlow(false)
    val isLoadingMore: StateFlow<Boolean> = _isLoadingMore.asStateFlow()

    private val apiService = RetrofitInstance.api

    init {
        loadPosts()
    }

    fun loadPosts() {
        viewModelScope.launch {
            _postState.value = PostState.Loading
            try {
                val posts = apiService.getPosts()
                _postState.value = PostState.Success(posts)
            } catch (e: Exception) {
                _postState.value = PostState.Error("Error loading posts: ${e.message}")
            }
        }
    }

    fun refreshPosts() {
        viewModelScope.launch {
            try {
                _isLoadingMore.value = true
                val posts = apiService.getPosts()
                _postState.value = PostState.Success(posts)
            } catch (e: Exception) {
                _postState.value = PostState.Error("Error refreshing posts: ${e.message}")
            } finally {
                _isLoadingMore.value = false
            }
        }
    }
}