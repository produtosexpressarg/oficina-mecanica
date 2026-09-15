/**
 * Sistema de Validaciones y Máscaras para Formularios
 * Taller Mecánico - Sistema de Gestión
 */

// ==================== MÁSCARAS ====================

/**
 * Aplicar máscara de DNI (8 dígitos + verificador argentino opcional o CUIL 11 dígitos)
 */
function mascaraDNI(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor.length <= 8) {
        // Formato DNI simple: 12.345.678
        valor = valor.replace(/(\d{2})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    } else {
        // Formato CUIL largo: 00-00000000-0
        valor = valor.slice(0, 11);
        if (valor.length > 2) valor = valor.slice(0,2) + '-' + valor.slice(2);
        if (valor.length > 11) valor = valor.slice(0,11) + '-' + valor.slice(11);
    }
    input.value = valor;
}
/** @deprecated usar mascaraDNI. Por compatibilidad con datos antiguos */
function mascaraCPF(input) { mascaraDNI(input); }

/**
 * Aplicar máscara de CUIT (formato argentino 00-00000000-0, 11 dígitos)
 */
function mascaraCUIT(input) {
    let valor = input.value.replace(/\D/g, '').slice(0, 11);
    if (valor.length > 2) valor = valor.slice(0,2) + '-' + valor.slice(2);
    if (valor.length > 11) valor = valor.slice(0,11) + '-' + valor.slice(11);
    input.value = valor;
}
/** @deprecated usar mascaraCUIT */
function mascaraCNPJ(input) { mascaraCUIT(input); }

/**
 * Aplicar máscara de teléfono (formato argentino)
 */
function mascaraTelefone(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor.length <= 10) {
        valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
        valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
        valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    }
    input.value = valor;
}

/**
 * Aplicar máscara de CPA (Código Postal Argentino, letras/números 8 chars)
 */
function mascaraCPA(input) {
    let valor = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    if (valor.length > 4) valor = valor.slice(0,4) + valor.slice(4);
    input.value = valor;
}
/** @deprecated usar mascaraCPA */
function mascaraCEP(input) { mascaraCPA(input); }

/**
 * Aplicar máscara de moneda (pesos argentinos $)
 */
function mascaraMoeda(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor === '') { input.value = ''; return; }
    valor = (parseInt(valor) / 100).toFixed(2);
    valor = valor.replace('.', ',');
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    input.value = '$ ' + valor;
}

/**
 * Aplicar máscara de patente (Mercosul / antiguo)
 */
function mascaraPlaca(input) {
    let valor = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (valor.length <= 7) {
        valor = valor.replace(/^([A-Z]{3})([0-9])/, '$1 $2');
    } else {
        valor = valor.replace(/^([A-Z]{3})([0-9])([A-Z])([0-9]{3})/, '$1 $2$3$4');
    }
    input.value = valor.slice(0, 8);
}

/**
 * Aplicar máscara de fecha (DD/MM/AAAA)
 */
function mascaraData(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{2})(\d)/, '$1/$2');
    valor = valor.replace(/(\d{2})(\d)/, '$1/$2');
    input.value = valor.slice(0, 10);
}

/**
 * Aplicar máscara de hora (HH:MM)
 */
function mascaraHora(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{2})(\d)/, '$1:$2');
    input.value = valor.slice(0, 5);
}

// ==================== VALIDACIONES ====================

/**
 * Validar DNI (longitud 7-8 dígitos sin dígito verificador o CUIL 11 dígitos)
 */
function validarDNI(dni) {
    const valor = dni.replace(/\D/g, '');
    if (valor.length >= 7 && valor.length <= 8) return /^\d{7,8}$/.test(valor);
    if (valor.length === 11) {
        // Validación simple de CUIL argentino
        const multi = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
        let suma = 0;
        for (let i = 0; i < 10; i++) suma += parseInt(valor.charAt(i)) * multi[i];
        let resto = 11 - (suma % 11);
        if (resto === 11) resto = 0;
        if (resto === 10) resto = 9;
        return parseInt(valor.charAt(10)) === resto;
    }
    return false;
}
/** @deprecated usar validarDNI */
function validarCPF(cpf) { return validarDNI(cpf); }

/**
 * Validar CUIT argentino (11 dígitos)
 */
function validarCUIT(cuit) {
    const valor = cuit.replace(/\D/g, '');
    if (valor.length !== 11) return false;
    const tipos = [20, 23, 24, 27, 30, 33, 34];
    const pref = parseInt(valor.slice(0, 2));
    if (!tipos.includes(pref)) return false;
    const multi = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;
    for (let i = 0; i < 10; i++) suma += parseInt(valor.charAt(i)) * multi[i];
    let resto = 11 - (suma % 11);
    if (resto === 11) resto = 0;
    if (resto === 10) resto = 9;
    return parseInt(valor.charAt(10)) === resto;
}
/** @deprecated usar validarCUIT */
function validarCNPJ(cnpj) { return validarCUIT(cnpj); }

/**
 * Validar email
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validar teléfono
 */
function validarTelefone(telefone) {
    const numeros = telefone.replace(/\D/g, '');
    return numeros.length >= 10 && numeros.length <= 11;
}

/**
 * Validar CPA (Código Postal Argentino)
 */
function validarCPA(cpa) {
    // Formato CPA Argentino: A0000AAA o simplificado 4-8 chars
    const regex = /^[A-Z]?\d{4}[A-Z]{0,3}$/i;
    const limpio = cpa.replace(/[^A-Za-z0-9]/g, '');
    return regex.test(limpio) && limpio.length >= 4 && limpio.length <= 8;
}
/** @deprecated usar validarCPA */
function validarCEP(cep) { return validarCPA(cep); }

/**
 * Validar fecha
 */
function validarData(data) {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(data)) return false;
    const partes = data.split('/');
    const dia = parseInt(partes[0]);
    const mes = parseInt(partes[1]);
    const ano = parseInt(partes[2]);
    const dataObj = new Date(ano, mes - 1, dia);
    return dataObj.getDate() === dia &&
           dataObj.getMonth() === mes - 1 &&
           dataObj.getFullYear() === ano;
}

/**
 * Validar patente de vehículo (formato argentino)
 */
function validarPlaca(placa) {
    const placaLimpa = placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const formatoAntigo = /^[A-Z]{3}\d{4}$/;
    const formatoMercosul = /^[A-Z]{3}\d[A-Z]\d{2}$/;
    return formatoAntigo.test(placaLimpa) || formatoMercosul.test(placaLimpa);
}

// ==================== APLICACIÓN AUTOMÁTICA ====================

/**
 * Inicializar máscaras y validaciones
 */
function inicializarValidacoes() {
    document.addEventListener('input', function(e) {
        const input = e.target;
        const mask = input.getAttribute('data-mask');
        if (!mask) return;
        switch(mask.toLowerCase()) {
            case 'dni':
            case 'cpf':
                mascaraDNI(input); break;
            case 'cuit':
            case 'cnpj':
                mascaraCUIT(input); break;
            case 'telefone':
                mascaraTelefone(input); break;
            case 'cpa':
            case 'cep':
                mascaraCPA(input); break;
            case 'moeda':
                mascaraMoeda(input); break;
            case 'placa':
                mascaraPlaca(input); break;
            case 'data':
                mascaraData(input); break;
            case 'hora':
                mascaraHora(input); break;
        }
    });

    document.addEventListener('blur', function(e) {
        const input = e.target;
        const validate = input.getAttribute('data-validate');
        if (!validate || !input.value) return;
        let isValid = true;
        let mensagem = '';
        switch(validate.toLowerCase()) {
            case 'dni':
            case 'cpf':
                isValid = validarDNI(input.value);
                mensagem = 'DNI / CUIL inválido';
                break;
            case 'cuit':
            case 'cnpj':
                isValid = validarCUIT(input.value);
                mensagem = 'CUIT inválido';
                break;
            case 'email':
                isValid = validarEmail(input.value);
                mensagem = 'Correo electrónico inválido';
                break;
            case 'telefone':
                isValid = validarTelefone(input.value);
                mensagem = 'Teléfono inválido';
                break;
            case 'cpa':
            case 'cep':
                isValid = validarCPA(input.value);
                mensagem = 'CPA inválido (Código Postal)';
                break;
            case 'data':
                isValid = validarData(input.value);
                mensagem = 'Fecha inválida';
                break;
            case 'placa':
                isValid = validarPlaca(input.value);
                mensagem = 'Patente inválida';
                break;
        }
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) errorElement.remove();
        if (isValid) {
            input.classList.remove('error');
            input.classList.add('valid');
        } else {
            input.classList.remove('valid');
            input.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = mensagem;
            input.parentNode.appendChild(errorDiv);
        }
    }, true);
}

/**
 * Validar formulario completo
 */
function validarFormulario(form) {
    const inputs = form.querySelectorAll('input[data-validate], input[required]');
    let isValid = true;
    inputs.forEach(input => {
        input.dispatchEvent(new Event('blur'));
        if (input.classList.contains('error') || (input.required && !input.value)) {
            isValid = false;
        }
    });
    return isValid;
}

/**
 * Limpiar validaciones del formulario
 */
function limparValidacoes(form) {
    const inputs = form.querySelectorAll('input');
    const errorMessages = form.querySelectorAll('.error-message');
    inputs.forEach(input => input.classList.remove('error', 'valid'));
    errorMessages.forEach(error => error.remove());
}

document.addEventListener('DOMContentLoaded', inicializarValidacoes);

window.validacoes = {
    mascaraDNI,
    mascaraCUIT,
    mascaraCPA,
    mascaraCPF,
    mascaraCNPJ,
    mascaraCEP,
    mascaraTelefone,
    mascaraMoeda,
    mascaraPlaca,
    mascaraData,
    mascaraHora,
    validarDNI,
    validarCUIT,
    validarCPA,
    validarCPF,
    validarCNPJ,
    validarCEP,
    validarEmail,
    validarTelefone,
    validarData,
    validarPlaca,
    validarFormulario,
    limparValidacoes
};
