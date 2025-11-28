package com.dsy.huertohogar.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dsy.huertohogar.model.Post
import com.dsy.huertohogar.repo.PostRepo
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class PostViewModel: ViewModel() {
    private val repo = PostRepo()
    private val _postList = MutableStateFlow<List<Post>>(emptyList())
    val postList: StateFlow<List<Post>> = _postList
    init {
        fetchPosts()
    }
    private fun fetchPosts() {
        viewModelScope.launch {
            try {
                _postList.value = repo.getPosts()
            }catch (e: Exception) {
                // Manejo de errores (puedes mejorar esto según tus necesidades)
                println("Error al obtener los posts: ${e.message}")
            }
        }
    }
}