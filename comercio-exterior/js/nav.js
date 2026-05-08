// Navegação simples entre seções
(function(){
    function setActive(linkId){
        const ids = ['nav-embarques','nav-pedidos','nav-fornecedores','nav-clientes','nav-financeiro'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (id === linkId) el.classList.add('active');
            else el.classList.remove('active');
        });
    }
    function showSection(sec){
        const map = {
            'embarques': 'sec-embarques',
            'pedidos': 'sec-pedidos'
        };
        Object.values(map).forEach(secId => {
            const el = document.getElementById(secId);
            if (el) el.style.display = 'none';
        });
        const target = document.getElementById(map[sec]);
        if (target) target.style.display = 'block';
    }
    document.addEventListener('DOMContentLoaded', () => {
        const navEmbarques = document.getElementById('nav-embarques');
        const navPedidos = document.getElementById('nav-pedidos');
        if (navEmbarques) navEmbarques.addEventListener('click', (e) => { e.preventDefault(); setActive('nav-embarques'); showSection('embarques'); });
        if (navPedidos) navPedidos.addEventListener('click', (e) => { e.preventDefault(); setActive('nav-pedidos'); showSection('pedidos'); });
        // estado inicial
        setActive('nav-embarques');
        showSection('embarques');
    });
})();