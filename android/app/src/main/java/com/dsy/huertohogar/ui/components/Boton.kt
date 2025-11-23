package com.dsy.huertohogar.ui.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable
fun Boton(
    texto: String,
    onClick: () -> Unit,
    modificador: Modifier = Modifier
){
    Button(onClick = onClick, modifier = modificador.fillMaxWidth()) {
        Text(text = texto)
    }
}