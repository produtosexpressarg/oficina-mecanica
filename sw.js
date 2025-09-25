// Service Worker para Sistema de Gestão de Oficina Mecânica
const CACHE_NAME = 'oficina-mecanica-v1';
const urlsToCache = [
    '/',
    '/pages/dashboard.html',
    '/pages/clientes.html',
    '/pages/servicos.html',
    '/pages/veiculos.html',
    '/pages/vendas.html',
    '/pages/estoque.html',
    '/pages/notas-fiscais.html',
    '/assets/css/design-system.css',
    '/assets/css/components.css',
    '/assets/css/layout.css',
    '/assets/css/responsive.css',
    '/assets/js/app.js',
    '/js/clientes.js',
    '/js/veiculos.js',
    '/js/vendas.js',
    '/assets/images/logo.png'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Retorna o cache se encontrado
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Atualizar Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});