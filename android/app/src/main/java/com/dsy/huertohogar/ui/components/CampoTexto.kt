package com.dsy.huertohogar.ui.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable
fun CampoTexto(
    valor: String,
    onValorChange: (String) -> Unit,
    etiqueta: String,
    modificador: Modifier = Modifier
){
    OutlinedTextField(
        value = valor,
        onValueChange = onValorChange,
        label = { Text(text = etiqueta) },
        modifier = modificador.fillMaxWidth()
    )
}