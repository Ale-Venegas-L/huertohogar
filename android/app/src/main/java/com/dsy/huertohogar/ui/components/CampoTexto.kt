package com.dsy.huertohogar.ui.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation

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

@Composable
fun CampoContraseña(
    valor:String,
    onValorChange: (String) -> Unit,
    etiqueta: String,
    modificador: Modifier=Modifier
){
    OutlinedTextField(
        value = valor,
        onValueChange = onValorChange,
        label = {Text(text = etiqueta)},
        visualTransformation = PasswordVisualTransformation(),
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
        modifier = modificador.fillMaxWidth()

    )
}