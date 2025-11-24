package com.dsy.huertohogar.data.remote

import com.dsy.huertohogar.model.Post
import retrofit2.http.GET

interface ApiService {
    @GET("posts")
    suspend fun getPosts(): List<Post>
}