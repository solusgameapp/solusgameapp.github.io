// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand(); // Разворачиваем WebApp на весь экран
        
        // Устанавливаем тему
        document.documentElement.classList.add(tg.colorScheme);
        
        // Анимируем появление приложения
        animateAppEntrance();
    }
    
    // Настройка обработчиков навигации
    setupNavigation();
    
    // Настройка маркетплейса
    setupMarketplace();
    
    // Настройка профиля
    setupProfile();
    
    // Настройка инфо-раздела
    setupInfo();
    
    // Настройка модальных окон
    setupModals();
    
    // Настройка корзины
    setupCart();
});

// Анимация появления приложения
function animateAppEntrance() {
    const app = document.getElementById('app');
    app.style.opacity = '0';
    app.style.transform = 'translateY(20px)';
    
    // Плавное появление
    setTimeout(() => {
        app.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        app.style.opacity = '1';
        app.style.transform = 'translateY(0)';
    }, 100);
}

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
    setupModal('level-info-modal', '#level-info-trigger', '.modal-close, .back-btn');
    
    // Модальное окно с деталями товара
    setupModal('product-details-modal', '#product-details-trigger', '.modal-close');
    
    // Модальное окно с корзиной
    setupModal('cart-modal', '#cart-button', '.modal-close');
    
    // Модальное окно для перевода
    setupModal('transfer-modal', '#transfer-trigger', '.modal-close');
    
    // Модальное окно о приложении
    setupModal('about-app-modal', '#about-app-trigger', '.modal-close, .back-btn');
    
    // Модальное окно для отправки фидбека
    setupModal('feedback-modal', '#feedback-trigger', '.modal-close');
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
        const cartIcon = document.querySelector('.cart-icon');
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
    const searchTrigger = document.getElementById('search-trigger');
    const searchPanel = document.querySelector('.search-panel');
    const searchInput = document.querySelector('.search-input');

    if (searchTrigger && searchPanel && searchInput) {
        searchTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            searchPanel.classList.toggle('active');
            
            if (searchPanel.classList.contains('active')) {
                setTimeout(() => {
                    searchInput.focus();
                }, 300);
            }
        });

        // Обработка поискового запроса
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const productCards = document.querySelectorAll('.product-card');
            
            productCards.forEach(card => {
                const productName = card.querySelector('.product-name').textContent.toLowerCase();
                const shouldShow = searchTerm === '' || productName.includes(searchTerm);
                
                if (shouldShow) {
                    card.style.display = '';
                    card.style.opacity = '1';
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });

        // Закрытие при клике вне панели
        document.addEventListener('click', function(e) {
            if (!searchPanel.contains(e.target) && 
                !searchTrigger.contains(e.target) && 
                searchPanel.classList.contains('active')) {
                searchPanel.classList.remove('active');
            }
        });

        // Предотвращаем закрытие при клике на панель
        searchPanel.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
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

// Настройка профиля
function setupProfile() {
    // Обработчик для прогресс-бара уровней
    const levelProgressBar = document.getElementById('level-info-trigger');
    if (levelProgressBar) {
        levelProgressBar.addEventListener('click', () => {
            const levelInfoModal = document.getElementById('level-info-modal');
            if (levelInfoModal) {
                levelInfoModal.classList.add('active');
                const modalContent = levelInfoModal.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.style.opacity = '0';
                    modalContent.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        modalContent.style.opacity = '1';
                        modalContent.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                }
            }
        });
    }

    // Обработчик для кнопки "Переглянути всі"
    const viewAllButton = document.getElementById('view-all-transactions');
    if (viewAllButton) {
        viewAllButton.addEventListener('click', () => {
            // Проверяем, существует ли модальное окно для всех транзакций
            let transactionsModal = document.getElementById('all-transactions-modal');
            
            // Если нет, создаем его
            if (!transactionsModal) {
                transactionsModal = document.createElement('div');
                transactionsModal.id = 'all-transactions-modal';
                transactionsModal.className = 'modal';
                
                // Создаем контент модального окна
                transactionsModal.innerHTML = `
                    <div class="modal-content">
                        <div class="modal-header">
                            <div class="modal-title">Всі транзакції</div>
                            <div class="modal-close">&times;</div>
                        </div>
                        <div class="modal-body">
                            <div class="all-transactions-list">
                                <div class="transaction-item">
                                    <div class="transaction-info">
                                        <div class="transaction-title">Річниця в компанії</div>
                                        <div class="transaction-date">15.05.2023</div>
                                    </div>
                                    <div class="transaction-amount positive">+500 SC</div>
                                </div>
                                
                                <div class="transaction-item">
                                    <div class="transaction-info">
                                        <div class="transaction-title">Придбання: Футболка Solus</div>
                                        <div class="transaction-date">20.05.2023</div>
                                    </div>
                                    <div class="transaction-amount negative">-200 SC</div>
                                </div>
                                
                                <div class="transaction-item">
                                    <div class="transaction-info">
                                        <div class="transaction-title">Бонус за проект</div>
                                        <div class="transaction-date">01.06.2023</div>
                                    </div>
                                    <div class="transaction-amount positive">+300 SC</div>
                                </div>
                                
                                <div class="transaction-item">
                                    <div class="transaction-info">
                                        <div class="transaction-title">День народження</div>
                                        <div class="transaction-date">10.07.2023</div>
                                    </div>
                                    <div class="transaction-amount positive">+400 SC</div>
                                </div>
                                
                                <div class="transaction-item">
                                    <div class="transaction-info">
                                        <div class="transaction-title">Придбання: Кружка</div>
                                        <div class="transaction-date">15.07.2023</div>
                                    </div>
                                    <div class="transaction-amount negative">-150 SC</div>
                                </div>
                                
                                <div class="transaction-item">
                                    <div class="transaction-info">
                                        <div class="transaction-title">Бонус за відгук</div>
                                        <div class="transaction-date">28.07.2023</div>
                                    </div>
                                    <div class="transaction-amount positive">+100 SC</div>
                                </div>
                                
                                <div class="transaction-item">
                                    <div class="transaction-info">
                                        <div class="transaction-title">Участь у заході</div>
                                        <div class="transaction-date">10.08.2023</div>
                                    </div>
                                    <div class="transaction-amount positive">+300 SC</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                // Добавляем модальное окно в приложение
                document.getElementById('app').appendChild(transactionsModal);
                
                // Настраиваем закрытие модального окна
                const closeButton = transactionsModal.querySelector('.modal-close');
                closeButton.addEventListener('click', () => {
                    transactionsModal.classList.remove('active');
                });
                
                // Закрытие при клике вне модального окна
                transactionsModal.addEventListener('click', (e) => {
                    if (e.target === transactionsModal) {
                        transactionsModal.classList.remove('active');
                    }
                });
            }
            
            // Показываем модальное окно
            transactionsModal.classList.add('active');
        });
    }
}

// Добавляем обработчики для выпадающего меню фильтров
document.getElementById('filter-trigger').addEventListener('click', function() {
    const dropdown = document.getElementById('filter-dropdown');
    
    // Изменяем стиль отображения вместо удаления класса
    if (dropdown.style.display === 'none' || !dropdown.style.display) {
        dropdown.style.display = 'block';
        dropdown.classList.add('active');
    } else {
        dropdown.classList.remove('active');
        setTimeout(() => {
            dropdown.style.display = 'none';
        }, 300); // Соответствует длительности перехода
    }
});

// Закрываем фильтры при клике вне их области
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('filter-dropdown');
    const filterIcon = document.getElementById('filter-trigger');
    
    if (dropdown.style.display !== 'none' && !dropdown.contains(event.target) && !filterIcon.contains(event.target)) {
        dropdown.classList.remove('active');
        setTimeout(() => {
            dropdown.style.display = 'none';
        }, 300);
    }
});

// Добавляем обработчики для новых карточек в разделе Инфо
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик для карточек с информацией
    const infoCards = document.querySelectorAll('#info .info-card');
    
    infoCards.forEach(card => {
        card.querySelector('.info-card-header').addEventListener('click', function() {
            // Проверяем, активна ли текущая карточка
            const isActive = card.classList.contains('active');
            
            // Закрываем все карточки
            infoCards.forEach(c => {
                c.classList.remove('active');
                c.querySelector('.toggle-icon').textContent = '▲';
            });
            
            // Если карточка не была активна, активируем её
            if (!isActive) {
                card.classList.add('active');
                card.querySelector('.toggle-icon').textContent = '▼';
            }
        });
    });
    
    // Активируем первую карточку по умолчанию
    if (infoCards.length > 0) {
        infoCards[0].classList.add('active');
        infoCards[0].querySelector('.toggle-icon').textContent = '▼';
    }
});

// Добавляем обработчики для карточек в разделе Инфо
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик для карточек с информацией
    document.getElementById('about-solus-card').addEventListener('click', function() {
        showInfoModal('Що таке Солус Коін', '<p>"Solus Coin" у контексті внутрішньої валюти для гейміфікації компанії, ймовірно, є корпоративною ініціативою, яка використовується для мотивації співробітників, заохочення певної поведінки або стимулювання продуктивності.</p>');
    });
    
    document.getElementById('levels-card').addEventListener('click', function() {
        let content = '<p>У системі є чотири рівні користувачів:</p>';
        content += '<ul>';
        content += '<li><span style="color: var(--level-bronze);">Бронзовий</span> – від 0 до 2000 SC</li>';
        content += '<li><span style="color: var(--level-silver);">Срібний</span> – від 2000 до 5000 SC</li>';
        content += '<li><span style="color: var(--level-gold);">Золотий</span> – від 5000 до 10000 SC</li>';
        content += '<li><span style="color: var(--level-diamond);">Діамантовий</span> – від 10000 SC</li>';
        content += '</ul>';
        content += '<p>Певні товари доступні лише на відповідних рівнях.</p>';
        
        showInfoModal('Рівні користувачів', content);
    });
    
    document.getElementById('how-to-get-card').addEventListener('click', function() {
        let content = '<p>Є багато способів отримати Solus Coins:</p>';
        content += '<ul>';
        content += '<li>Виконання проектів – від 300 до 1000 SC</li>';
        content += '<li>День народження – 400 SC</li>';
        content += '<li>Річниця в компанії – 500 SC за кожен рік</li>';
        content += '<li>Участь у внутрішніх заходах – від 100 до 500 SC</li>';
        content += '<li>Подання ідей та пропозицій – від 50 до 200 SC</li>';
        content += '</ul>';
        
        showInfoModal('Як отримати SC', content);
    });
    
    // Функция для отображения модального окна с информацией
    function showInfoModal(title, content) {
        // Если у нас уже есть модальное окно для информации
        if (document.getElementById('info-content-modal')) {
            document.getElementById('info-modal-title').textContent = title;
            document.getElementById('info-modal-content').innerHTML = content;
            document.getElementById('info-content-modal').classList.add('active');
        } else {
            // Создаем новое модальное окно
            let modal = document.createElement('div');
            modal.id = 'info-content-modal';
            modal.className = 'modal';
            
            let modalContent = `
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-title" id="info-modal-title">${title}</div>
                        <div class="modal-close">&times;</div>
                    </div>
                    <div class="modal-body">
                        <div id="info-modal-content">${content}</div>
                        <button class="back-btn">Назад</button>
                    </div>
                </div>
            `;
            
            modal.innerHTML = modalContent;
            document.querySelector('#app').appendChild(modal);
            
            // Добавляем обработчики событий
            modal.querySelector('.modal-close').addEventListener('click', function() {
                modal.classList.remove('active');
            });
            
            modal.querySelector('.back-btn').addEventListener('click', function() {
                modal.classList.remove('active');
            });
            
            // Активируем модальное окно
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
        }
    }
}); 