// Инициализация телеграм мини-приложения
let tg = window.Telegram.WebApp;
tg.expand();

// Основная функциональность приложения
document.addEventListener('DOMContentLoaded', function() {
    // Проверка активной страницы при загрузке
    const activePage = document.querySelector('.page.active');
    if (!activePage) {
        // Если нет активной страницы, активируем профиль
        document.getElementById('profile').classList.add('active');
        document.querySelector('.nav-button[data-target="profile"]').classList.add('active');
    }
    
    // Навигация между табами
    const navButtons = document.querySelectorAll('.nav-button');
    const pages = document.querySelectorAll('.page');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageId = button.getAttribute('data-target');
            
            // Активируем нужную страницу
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === pageId) {
                    page.classList.add('active');
                }
            });
            
            // Активируем нужную кнопку навигации
            navButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
    });
    
    // Обработчики для аккордеонов в информационном разделе
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            accordionItem.classList.toggle('active');
            
            // Меняем иконку
            const toggleIcon = header.querySelector('.toggle-icon');
            if (toggleIcon) {
                toggleIcon.textContent = accordionItem.classList.contains('active') ? '▼' : '▲';
            }
        });
    });
    
    // Анимация прогресс-бара при загрузке
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            // Убеждаемся, что ширина не установлена или равна 0
            if (!bar.style.width || bar.style.width === '0px' || bar.style.width === '0%') {
                // Используем атрибут data-width или значение по умолчанию
                const targetWidth = bar.getAttribute('data-width') || '65%';
                bar.style.width = targetWidth;
            }
        });
    }, 500);
    
    // Настройка модальных окон
    setupModals();
    
    // Обработчики для корзины
    setupCart();
    
    // Обработчики для деталей товара
    setupProductDetails();
    
    // Обработчики для перевода
    setupTransferFunctionality();
    
    // Обработчик для нижней кнопки админ-панели
    const adminButton = document.getElementById('admin-button');
    if (adminButton) {
        adminButton.addEventListener('click', function() {
            window.location.href = 'admin.html';
        });
    }
    
    // Обработчик для фиксированной иконки админ-панели
    const adminIcon = document.querySelector('.admin-icon');
    if (adminIcon) {
        adminIcon.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'admin.html';
        });
    }
    
    // Инициализируем функционал поиска
    setupSearchFunctionality();
});

// Настройка модальных окон
function setupModals() {
    // Модальное окно с информацией об уровнях
    setupModal('level-info-modal', '.user-level', '.modal-close, .back-btn');
    
    // Модальное окно с деталями товара
    setupModal('product-details-modal', '#product-details-trigger', '.modal-close');
    
    // Модальное окно с корзиной
    setupModal('cart-modal', '#cart-button', '.modal-close');
    
    // Модальное окно для перевода
    setupModal('transfer-modal', '#transfer-trigger', '.modal-close');
    
    // Модальное окно о приложении
    setupModal('about-app-modal', '#about-app-trigger', '.modal-close, .back-btn');
}

// Функция настройки модального окна
function setupModal(modalId, triggerSelector, closeSelector) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    const triggers = document.querySelectorAll(triggerSelector);
    const closeButtons = modal.querySelectorAll(closeSelector);
    
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            modal.classList.add('active');
        });
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    });
    
    // Закрытие модального окна при клике вне его содержимого
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Настройка корзины и товаров
function setupCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, .add-to-cart-detail-btn');
    const cartBadge = document.querySelector('.cart-badge');
    const cartIcon = document.querySelector('.cart-icon');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Обновляем отображение количества товаров в корзине
    updateCartBadge();
    
    // Создаем плавающий индикатор корзины
    createFloatingCartIndicator();
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const productCard = this.closest('.product-card') || this.closest('.product-details-content');
            const productId = productCard.dataset.id || document.querySelector('#product-details-modal').dataset.productId;
            const productName = productCard.querySelector('.product-name').textContent || document.querySelector('.product-details-name').textContent;
            const productPrice = parseInt(productCard.querySelector('.price').textContent || document.querySelector('.product-details-price').textContent);
            const productImage = productCard.querySelector('.product-image')?.src || document.querySelector('.product-details-main-img').src;
            const quantity = productCard.querySelector('.quantity') ? parseInt(productCard.querySelector('.quantity').textContent) : 1;
            
            // Добавляем анимацию перемещения товара в корзину
            animateAddToCart(e, this);
            
            // Добавляем товар в корзину
            addToCart(productId, productName, productPrice, productImage, quantity);
            
            // Показываем плавающий индикатор корзины
            showFloatingCartIndicator();
            
            // Подсвечиваем корзину
            highlightCart();
        });
    });
    
    // Функция для обновления отображения количества товаров в корзине
    function updateCartBadge() {
        const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        cartBadge.textContent = totalQuantity;
        
        if (totalQuantity > 0) {
            cartBadge.classList.add('updated');
            setTimeout(() => {
                cartBadge.classList.remove('updated');
            }, 500);
        } else {
            cartBadge.textContent = '0';
        }
    }
    
    // Анимация добавления товара в корзину
    function animateAddToCart(e, button) {
        const appContainer = document.getElementById('app');
        const rect = appContainer.getBoundingClientRect();
        
        // Вычисляем координаты относительно контейнера приложения
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Создаем элемент для анимации
        const animationElement = document.createElement('div');
        animationElement.className = 'item-to-cart-animation';
        animationElement.style.top = `${y}px`;
        animationElement.style.left = `${x}px`;
        animationElement.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>';
        
        // Добавляем элемент в контейнер приложения, а не в body
        appContainer.appendChild(animationElement);
        
        // Анимируем корзину
        cartIcon.classList.add('item-added');
        
        // Удаляем элемент после анимации
        setTimeout(() => {
            animationElement.remove();
            cartIcon.classList.remove('item-added');
        }, 800);
    }
    
    // Функция для добавления товара в корзину
    function addToCart(id, name, price, image, quantity) {
        // Проверяем, есть ли товар уже в корзине
        const existingItem = cartItems.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cartItems.push({
                id,
                name,
                price,
                image,
                quantity
            });
        }
        
        // Сохраняем в localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Обновляем отображение
        updateCartBadge();
    }
    
    // Создаем плавающий индикатор корзины
    function createFloatingCartIndicator() {
        if (!document.querySelector('.floating-cart-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'floating-cart-indicator';
            indicator.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span>Товар додано до кошика</span>
                <span class="item-count"></span>
            `;
            // Добавляем индикатор в контейнер приложения, а не в body
            document.getElementById('app').appendChild(indicator);
            
            // Добавляем обработчик клика на индикатор
            indicator.addEventListener('click', function() {
                document.getElementById('cart-button').click();
                this.classList.remove('show');
            });
        }
    }
    
    // Показываем плавающий индикатор корзины
    function showFloatingCartIndicator() {
        const indicator = document.querySelector('.floating-cart-indicator');
        const itemCount = indicator.querySelector('.item-count');
        const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        
        itemCount.textContent = `(${totalItems})`;
        indicator.classList.add('show');
        
        // Скрываем индикатор через 3 секунды
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 3000);
    }
    
    // Подсвечиваем корзину
    function highlightCart() {
        cartIcon.classList.add('cart-highlight');
        setTimeout(() => {
            cartIcon.classList.remove('cart-highlight');
        }, 1500);
    }
    
    // Обработчик клика на иконку корзины
    cartIcon.addEventListener('click', function() {
        // Заполняем корзину данными
        const cartItemsContainer = document.querySelector('.cart-items');
        const totalPriceElement = document.querySelector('.total-price');
        
        // Очищаем контейнер
        cartItemsContainer.innerHTML = '';
        
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Ваш кошик порожній</p>';
            totalPriceElement.textContent = '0 SC';
        } else {
            let totalPrice = 0;
            
            cartItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <img src="${item.image}" class="cart-item-img" alt="${item.name}">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price} SC</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">×</button>
                `;
                
                cartItemsContainer.appendChild(itemElement);
                totalPrice += item.price * item.quantity;
            });
            
            totalPriceElement.textContent = `${totalPrice} SC`;
            
            // Добавляем обработчики для кнопок изменения количества и удаления
            setupCartItemButtons();
        }
        
        // Показываем модальное окно корзины
        document.getElementById('cart-modal').classList.add('active');
    });
    
    // Настройка кнопок в корзине
    function setupCartItemButtons() {
        // Кнопка минус
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.dataset.id;
                const item = cartItems.find(item => item.id === itemId);
                
                if (item.quantity > 1) {
                    item.quantity--;
                    this.nextElementSibling.textContent = item.quantity;
                    updateTotalPrice();
                    updateCartBadge();
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                }
            });
        });
        
        // Кнопка плюс
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.dataset.id;
                const item = cartItems.find(item => item.id === itemId);
                
                item.quantity++;
                this.previousElementSibling.textContent = item.quantity;
                updateTotalPrice();
                updateCartBadge();
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            });
        });
        
        // Кнопка удаления
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.dataset.id;
                cartItems = cartItems.filter(item => item.id !== itemId);
                
                this.closest('.cart-item').remove();
                updateTotalPrice();
                updateCartBadge();
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                
                if (cartItems.length === 0) {
                    document.querySelector('.cart-items').innerHTML = '<p class="empty-cart-message">Ваш кошик порожній</p>';
                    document.querySelector('.total-price').textContent = '0 SC';
                }
            });
        });
    }
    
    // Обновление общей суммы в корзине
    function updateTotalPrice() {
        const totalPriceElement = document.querySelector('.total-price');
        const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        totalPriceElement.textContent = `${totalPrice} SC`;
    }
    
    // Закрытие модальных окон
    document.querySelectorAll('.modal-close, .cancel-btn').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    
    // Кнопка оформления заказа
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        if (cartItems.length > 0) {
            // Здесь будет логика оформления заказа
            showNotification('Замовлення успішно оформлено!');
            
            // Очищаем корзину
            cartItems = [];
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartBadge();
            
            // Закрываем модальное окно
            document.getElementById('cart-modal').classList.remove('active');
        }
    });
}

// Настройка функционала для деталей товара
function setupProductDetails() {
    // Переключение между миниатюрами на странице деталей товара
    const thumbnails = document.querySelectorAll('.product-thumbnail');
    const mainImage = document.getElementById('main-product-image');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            // Обновляем основное изображение
            mainImage.src = thumbnail.getAttribute('data-img');
            
            // Обновляем активную миниатюру
            thumbnails.forEach(thumb => {
                thumb.classList.remove('active');
            });
            thumbnail.classList.add('active');
        });
    });
    
    // Обработка изменения количества
    const plusBtn = document.querySelector('.product-details-actions .plus');
    const minusBtn = document.querySelector('.product-details-actions .minus');
    const quantityElement = document.querySelector('.product-details-actions .quantity');
    
    if (plusBtn && minusBtn && quantityElement) {
        plusBtn.addEventListener('click', () => {
            let quantity = parseInt(quantityElement.textContent);
            quantity++;
            quantityElement.textContent = quantity;
        });
        
        minusBtn.addEventListener('click', () => {
            let quantity = parseInt(quantityElement.textContent);
            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;
            }
        });
    }
}

// Настройка функционала для перевода коинов
function setupTransferFunctionality() {
    const sendCoinsBtn = document.querySelector('.send-coins-btn');
    
    if (sendCoinsBtn) {
        sendCoinsBtn.addEventListener('click', () => {
            const modal = document.getElementById('transfer-modal');
            const recipient = modal.querySelector('#recipient').value;
            const amount = modal.querySelector('#amount').value;
            
            if (recipient && amount) {
                showNotification(`Переказано ${amount} SC користувачу ${recipient}`);
                
                // Очищаем форму
                modal.querySelector('#recipient').value = '';
                modal.querySelector('#amount').value = '100';
                modal.querySelector('#message').value = '';
                
                // Закрываем модальное окно
                modal.classList.remove('active');
            } else {
                showNotification('Заповніть всі обов\'язкові поля');
            }
        });
    }
}

// Функционал поиска в маркетплейсе
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.marketplace-search');
    const productCards = document.querySelectorAll('.product-card');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        // Если поле поиска пустое, показываем все товары
        if (searchTerm === '') {
            productCards.forEach(card => {
                card.style.display = '';
            });
            return;
        }
        
        // Фильтруем товары по названию
        productCards.forEach(card => {
            const productName = card.querySelector('.product-name').textContent.toLowerCase();
            const productLevel = card.querySelector('.product-level').textContent.toLowerCase();
            
            // Проверяем, содержит ли название товара или уровень введенный текст
            if (productName.includes(searchTerm) || productLevel.includes(searchTerm)) {
                // Показываем карточку с анимацией
                card.style.display = '';
                card.classList.add('fade-in');
                setTimeout(() => {
                    card.classList.remove('fade-in');
                }, 300);
            } else {
                // Скрываем карточку с анимацией
                card.classList.add('fade-out');
                setTimeout(() => {
                    card.style.display = 'none';
                    card.classList.remove('fade-out');
                }, 300);
            }
        });
    });
    
    // Добавляем стили для анимации
    const style = document.createElement('style');
    style.textContent += `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(10px); }
        }
        
        .fade-in {
            animation: fadeIn 0.3s ease forwards;
        }
        
        .fade-out {
            animation: fadeOut 0.3s ease forwards;
        }
    `;
    document.head.appendChild(style);
}

// Функция для отображения уведомлений
function showNotification(message) {
    // Удаляем предыдущие уведомления
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Добавляем на страницу внутри контейнера приложения, а не в body
    document.getElementById('app').appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Через 3 секунды скрываем уведомление
    setTimeout(() => {
        notification.classList.remove('show');
        // После завершения анимации удаляем элемент
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Дополнительные стили для уведомлений
const style = document.createElement('style');
style.textContent = `
.notification {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background-color: rgba(35, 46, 60, 0.9);
    color: white;
    padding: 12px 20px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
    z-index: 1000;
    text-align: center;
    max-width: 90%;
}

.notification.show {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
}

.adding {
    animation: pulse 0.3s ease-in-out;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

.user-avatar img {
    transition: transform 0.3s ease;
}

.user-avatar:active img {
    transform: scale(0.95);
}

.product-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}
`;
document.head.appendChild(style); 