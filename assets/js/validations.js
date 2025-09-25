/**
 * Sistema de Validações e Máscaras para Formulários
 * Oficina Mecânica - Sistema de Gestão
 */

// ==================== MÁSCARAS ====================

/**
 * Aplicar máscara de CPF
 */
function mascaraCPF(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = valor;
}

/**
 * Aplicar máscara de CNPJ
 */
function mascaraCNPJ(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
    valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
    input.value = valor;
}

/**
 * Aplicar máscara de telefone
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
 * Aplicar máscara de CEP
 */
function mascaraCEP(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    input.value = valor;
}

/**
 * Aplicar máscara de moeda (Real)
 */
function mascaraMoeda(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = (valor / 100).toFixed(2) + '';
    valor = valor.replace(".", ",");
    valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    input.value = 'R$ ' + valor;
}

/**
 * Aplicar máscara de placa de veículo
 */
function mascaraPlaca(input) {
    let valor = input.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Formato antigo: ABC-1234
    if (valor.length <= 7 && !/\d[A-Z]/.test(valor)) {
        valor = valor.replace(/(\w{3})(\w)/, '$1-$2');
    }
    // Formato Mercosul: ABC1D23
    else if (valor.length <= 7) {
        valor = valor.replace(/(\w{3})(\w)(\w{2})/, '$1$2$5');
    }
    
    input.value = valor;
}

/**
 * Aplicar máscara de data
 */
function mascaraData(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{2})(\d)/, '$1/$2');
    valor = valor.replace(/(\d{2})(\d)/, '$1/$2');
    input.value = valor;
}

/**
 * Aplicar máscara de hora
 */
function mascaraHora(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{2})(\d)/, '$1:$2');
    input.value = valor;
}

// ==================== VALIDAÇÕES ====================

/**
 * Validar CPF
 */
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = resto < 2 ? 0 : resto;
    
    if (parseInt(cpf.charAt(9)) !== digito1) {
        return false;
    }
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto < 2 ? 0 : resto;
    
    return parseInt(cpf.charAt(10)) === digito2;
}

/**
 * Validar CNPJ
 */
function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
        return false;
    }
    
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) {
        return false;
    }
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    return resultado === parseInt(digitos.charAt(1));
}

/**
 * Validar email
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validar telefone
 */
function validarTelefone(telefone) {
    const numeros = telefone.replace(/\D/g, '');
    return numeros.length >= 10 && numeros.length <= 11;
}

/**
 * Validar CEP
 */
function validarCEP(cep) {
    const regex = /^\d{5}-?\d{3}$/;
    return regex.test(cep);
}

/**
 * Validar data
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
 * Validar placa de veículo
 */
function validarPlaca(placa) {
    const placaLimpa = placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Formato antigo: ABC1234
    const formatoAntigo = /^[A-Z]{3}\d{4}$/;
    // Formato Mercosul: ABC1D23
    const formatoMercosul = /^[A-Z]{3}\d[A-Z]\d{2}$/;
    
    return formatoAntigo.test(placaLimpa) || formatoMercosul.test(placaLimpa);
}

// ==================== APLICAÇÃO AUTOMÁTICA ====================

/**
 * Inicializar máscaras e validações
 */
function inicializarValidacoes() {
    // Aplicar máscaras automaticamente baseado em data-mask
    document.addEventListener('input', function(e) {
        const input = e.target;
        const mask = input.getAttribute('data-mask');
        
        switch(mask) {
            case 'cpf':
                mascaraCPF(input);
                break;
            case 'cnpj':
                mascaraCNPJ(input);
                break;
            case 'telefone':
                mascaraTelefone(input);
                break;
            case 'cep':
                mascaraCEP(input);
                break;
            case 'moeda':
                mascaraMoeda(input);
                break;
            case 'placa':
                mascaraPlaca(input);
                break;
            case 'data':
                mascaraData(input);
                break;
            case 'hora':
                mascaraHora(input);
                break;
        }
    });
    
    // Validar campos ao perder o foco
    document.addEventListener('blur', function(e) {
        const input = e.target;
        const validate = input.getAttribute('data-validate');
        
        if (!validate || !input.value) return;
        
        let isValid = true;
        let mensagem = '';
        
        switch(validate) {
            case 'cpf':
                isValid = validarCPF(input.value);
                mensagem = 'CPF inválido';
                break;
            case 'cnpj':
                isValid = validarCNPJ(input.value);
                mensagem = 'CNPJ inválido';
                break;
            case 'email':
                isValid = validarEmail(input.value);
                mensagem = 'Email inválido';
                break;
            case 'telefone':
                isValid = validarTelefone(input.value);
                mensagem = 'Telefone inválido';
                break;
            case 'cep':
                isValid = validarCEP(input.value);
                mensagem = 'CEP inválido';
                break;
            case 'data':
                isValid = validarData(input.value);
                mensagem = 'Data inválida';
                break;
            case 'placa':
                isValid = validarPlaca(input.value);
                mensagem = 'Placa inválida';
                break;
        }
        
        // Remover mensagens de erro anteriores
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        
        // Aplicar estilo de erro/sucesso
        if (isValid) {
            input.classList.remove('error');
            input.classList.add('valid');
        } else {
            input.classList.remove('valid');
            input.classList.add('error');
            
            // Adicionar mensagem de erro
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = mensagem;
            input.parentNode.appendChild(errorDiv);
        }
    });
}

/**
 * Validar formulário completo
 */
function validarFormulario(form) {
    const inputs = form.querySelectorAll('input[data-validate], input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        // Disparar evento blur para validar
        input.dispatchEvent(new Event('blur'));
        
        if (input.classList.contains('error') || (input.required && !input.value)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Limpar validações do formulário
 */
function limparValidacoes(form) {
    const inputs = form.querySelectorAll('input');
    const errorMessages = form.querySelectorAll('.error-message');
    
    inputs.forEach(input => {
        input.classList.remove('error', 'valid');
    });
    
    errorMessages.forEach(error => {
        error.remove();
    });
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', inicializarValidacoes);

// Exportar funções para uso global
window.validacoes = {
    mascaraCPF,
    mascaraCNPJ,
    mascaraTelefone,
    mascaraCEP,
    mascaraMoeda,
    mascaraPlaca,
    mascaraData,
    mascaraHora,
    validarCPF,
    validarCNPJ,
    validarEmail,
    validarTelefone,
    validarCEP,
    validarData,
    validarPlaca,
    validarFormulario,
    limparValidacoes
};