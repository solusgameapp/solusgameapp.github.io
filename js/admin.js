// Инициализация телеграм мини-приложения
let tg = window.Telegram.WebApp;
tg.expand();

// Основная функциональность админ-панели
document.addEventListener('DOMContentLoaded', function() {
    // Навигация в админке
    const adminCards = document.querySelectorAll('.admin-card');
    const backButtons = document.querySelectorAll('.back-btn');
    const pages = document.querySelectorAll('.page');
    
    // Переход из меню в разделы с анимацией
    adminCards.forEach(card => {
        card.addEventListener('click', () => {
            const pageId = card.getAttribute('data-page');
            
            // Добавляем класс с эффектом пульсации при клике
            card.classList.add('pulse');
            setTimeout(() => {
                card.classList.remove('pulse');
            }, 300);
            
            // Активируем нужную страницу с плавной анимацией
            pages.forEach(page => {
                if (page.classList.contains('active')) {
                    page.classList.add('fade-out');
                    setTimeout(() => {
                        page.classList.remove('active');
                        page.classList.remove('fade-out');
                        
                        // Активируем новую страницу
                        if (page.id === pageId) return; // Если та же страница, ничего не делаем
                        
                        const targetPage = document.getElementById(pageId);
                        if (targetPage) {
                            targetPage.classList.add('active', 'fade-in');
                            setTimeout(() => {
                                targetPage.classList.remove('fade-in');
                            }, 300);
                        }
                    }, 200);
                } else if (page.id === pageId) {
                    page.classList.add('active', 'fade-in');
                    setTimeout(() => {
                        page.classList.remove('fade-in');
                    }, 300);
                }
            });
        });
    });
    
    // Кнопка назад с анимацией
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Рипл-эффект для кнопки
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            button.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
            }, 500);
            
            // Анимация перехода на главную страницу
            const currentPage = document.querySelector('.page.active');
            if (currentPage) {
                currentPage.classList.add('slide-out');
                setTimeout(() => {
                    currentPage.classList.remove('active', 'slide-out');
                    
                    // Активируем главное меню с анимацией
                    const dashboard = document.getElementById('admin-dashboard');
                    if (dashboard) {
                        dashboard.classList.add('active', 'slide-in');
                        setTimeout(() => {
                            dashboard.classList.remove('slide-in');
                        }, 300);
                    }
                }, 200);
            }
        });
    });
    
    // Выход из админки
    const exitAdminBtn = document.querySelector('.exit-admin-btn');
    if (exitAdminBtn) {
        exitAdminBtn.addEventListener('click', () => {
            // Анимация при выходе
            document.body.classList.add('fade-out');
            setTimeout(() => {
                // Переход на страницу пользователя
                window.location.href = 'index.html';
            }, 300);
        });
    }
    
    // Модальные окна
    setupModals();
    
    // Вкладки в управлении маркетплейсом
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Рипл-эффект для кнопки
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            button.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
            }, 500);
            
            // Активируем нужную вкладку с анимацией
            document.querySelectorAll('.tab-content').forEach(tab => {
                if (tab.classList.contains('active')) {
                    tab.classList.add('fade-out');
                    setTimeout(() => {
                        tab.classList.remove('active', 'fade-out');
                        
                        // Активируем новую вкладку
                        if (tab.id === tabId + '-tab') return; // Если та же вкладка, ничего не делаем
                        
                        const targetTab = document.getElementById(tabId + '-tab');
                        if (targetTab) {
                            targetTab.classList.add('active', 'fade-in');
                            setTimeout(() => {
                                targetTab.classList.remove('fade-in');
                            }, 300);
                        }
                    }, 200);
                } else if (tab.id === tabId + '-tab') {
                    tab.classList.add('active', 'fade-in');
                    setTimeout(() => {
                        tab.classList.remove('fade-in');
                    }, 300);
                }
            });
            
            // Активируем нужную кнопку
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
    });
    
    // Анимация при загрузке страницы
    animateOnLoad();
});

// Анимация при загрузке
function animateOnLoad() {
    const dashboard = document.getElementById('admin-dashboard');
    if (dashboard && dashboard.classList.contains('active')) {
        const cards = dashboard.querySelectorAll('.admin-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s var(--animation-bounce)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 + index * 100);
        });
    }
}

// Настройка модальных окон
function setupModals() {
    // Добавление коинов пользователю
    setupModal('add-coins-modal', '.add-coins-btn', '.modal-close, .cancel-btn');
    
    // Редактирование товара
    setupModal('edit-product-modal', '.edit-product-btn', '.modal-close, .cancel-btn');
}

// Функция настройки модального окна
function setupModal(modalId, triggerSelector, closeSelector) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    const triggers = document.querySelectorAll(triggerSelector);
    const closeButtons = modal.querySelectorAll(closeSelector);
    
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Анимация при открытии
            modal.style.display = 'flex';
            modal.classList.add('opening');
            
            setTimeout(() => {
                modal.classList.add('active');
                modal.classList.remove('opening');
            }, 10);
            
            // Если это кнопка добавления коинов, устанавливаем имя пользователя
            if (triggerSelector === '.add-coins-btn') {
                const userItem = trigger.closest('.user-item');
                if (userItem) {
                    const userName = userItem.querySelector('.user-name').textContent;
                    modal.querySelector('.user-name-display').textContent = userName;
                }
            }
        });
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Анимация при закрытии
            modal.classList.add('closing');
            setTimeout(() => {
                modal.classList.remove('active', 'closing');
                modal.style.display = 'none';
            }, 300);
        });
    });
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            // Анимация при закрытии
            modal.classList.add('closing');
            setTimeout(() => {
                modal.classList.remove('active', 'closing');
                modal.style.display = 'none';
            }, 300);
        }
    });
}

// Инициализация режима редактирования таблицы задач
document.addEventListener('DOMContentLoaded', function() {
    const editBtn = document.querySelector('.edit-btn');
    
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            // Анимация нажатия
            editBtn.classList.add('pulse');
            setTimeout(() => {
                editBtn.classList.remove('pulse');
            }, 300);
            
            toggleTableEditMode();
        });
    }
});

// Переключение режима редактирования таблицы
function toggleTableEditMode() {
    const table = document.querySelector('.admin-table');
    const isEditable = table.classList.contains('editable');
    const editBtn = document.querySelector('.edit-btn');
    
    if (!isEditable) {
        // Включаем режим редактирования
        table.classList.add('editable');
        editBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
        `;
        
        // Делаем ячейки редактируемыми с анимацией
        const cells = table.querySelectorAll('tbody td');
        cells.forEach((cell, index) => {
            setTimeout(() => {
                cell.setAttribute('contenteditable', 'true');
                cell.classList.add('editable-cell');
                
                // Анимация ячейки
                cell.classList.add('highlight');
                setTimeout(() => {
                    cell.classList.remove('highlight');
                }, 500);
            }, index * 50);
        });
        
        // Добавляем кнопку для новой строки с анимацией
        const tfoot = document.createElement('tfoot');
        tfoot.innerHTML = `
            <tr>
                <td colspan="3">
                    <button class="add-row-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Додати нове завдання
                    </button>
                </td>
            </tr>
        `;
        tfoot.style.opacity = '0';
        table.appendChild(tfoot);
        
        setTimeout(() => {
            tfoot.style.transition = 'opacity 0.5s';
            tfoot.style.opacity = '1';
        }, 100);
        
        // Обработчик для добавления строки
        const addRowBtn = table.querySelector('.add-row-btn');
        addRowBtn.addEventListener('click', function() {
            addNewRow(table);
        });
    } else {
        // Выключаем режим редактирования
        table.classList.remove('editable');
        editBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
        `;
        
        // Убираем атрибут contenteditable с анимацией
        const cells = table.querySelectorAll('tbody td');
        cells.forEach((cell, index) => {
            setTimeout(() => {
                // Анимация сохранения
                cell.classList.add('saved');
                setTimeout(() => {
                    cell.classList.remove('saved');
                    cell.removeAttribute('contenteditable');
                    cell.classList.remove('editable-cell');
                }, 500);
            }, index * 50);
        });
        
        // Удаляем tfoot с кнопкой добавления с анимацией
        const tfoot = table.querySelector('tfoot');
        if (tfoot) {
            tfoot.style.transition = 'opacity 0.5s';
            tfoot.style.opacity = '0';
            setTimeout(() => {
                table.removeChild(tfoot);
            }, 500);
        }
        
        // Показываем уведомление о сохранении
        showNotification('Зміни збережено успішно');
    }
}

// Добавление новой строки в таблицу
function addNewRow(table) {
    const tbody = table.querySelector('tbody');
    const newRow = document.createElement('tr');
    
    // Создаем ячейки с плейсхолдерами
    newRow.innerHTML = `
        <td contenteditable="true" class="editable-cell">Нове завдання</td>
        <td contenteditable="true" class="editable-cell">Опис завдання</td>
        <td contenteditable="true" class="editable-cell">0</td>
    `;
    
    // Скрываем строку для анимации
    newRow.style.opacity = '0';
    newRow.style.transform = 'translateY(-20px)';
    
    // Добавляем в таблицу
    tbody.appendChild(newRow);
    
    // Запускаем анимацию появления
    setTimeout(() => {
        newRow.style.transition = 'opacity 0.5s, transform 0.5s var(--animation-bounce)';
        newRow.style.opacity = '1';
        newRow.style.transform = 'translateY(0)';
    }, 10);
    
    // Фокус на первую ячейку
    setTimeout(() => {
        newRow.querySelector('td').focus();
    }, 300);
}

// Функция показа уведомления
function showNotification(message) {
    // Проверяем, существует ли уже уведомление
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        // Создаем новое уведомление
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Устанавливаем текст и показываем уведомление
    notification.textContent = message;
    notification.classList.add('active');
    
    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
} 