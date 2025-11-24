package com.dsy.huertohogar.repo

import com.dsy.huertohogar.data.remote.RetrofitInstance
import com.dsy.huertohogar.model.Post


class PostRepo {
    suspend fun getPosts(): List<Post> {
        return RetrofitInstance.api.getPosts()
    }
}