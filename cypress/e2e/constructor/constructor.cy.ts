/// <reference types="cypress" />
export {};

const bunIngredientSelector = '[data-cy=bun-ingredients]';
const constructorIngredientSelector = '[data-cy=constructor-ingredients]';
const modalIngredientSelector = '[data-cy=modal-ingredient]';
const closeButtonSelector = '[data-cy=closeButton]';
const modalSuccessOrderSelector = '[data-cy=modal-successOrder]';

describe('add ingredients to constructor works correctly', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000/');
  });

  it('should add bun', function () {
    // Проверяем, что булка отсутствует в конструкторе
    cy.get('[data-cy=constructor-bun-1]').should('not.exist');
    cy.get('[data-cy=constructor-bun-2]').should('not.exist');

    // Добавляем булку
    cy.get(bunIngredientSelector).contains('Добавить').click();

    // Проверяем, что булка добавлена в конструктор
    cy.get('[data-cy=constructor-bun-1]')
      .contains('Краторная булка N-200i (верх)')
      .should('exist');
    cy.get('[data-cy=constructor-bun-2]')
      .contains('Краторная булка N-200i (низ)')
      .should('exist');
  });

  it('should add ingredient', function () {
    // Проверяем, что ингредиенты отсутствуют в конструкторе
    cy.get(constructorIngredientSelector)
      .contains('Биокотлета из марсианской Магнолии')
      .should('not.exist');
    cy.get(constructorIngredientSelector)
      .contains('Соус Spicy-X')
      .should('not.exist');

    // Добавляем ингредиенты
    cy.get('[data-cy=main-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=sauces-ingredients]').contains('Добавить').click();

    // Проверяем, что ингредиенты добавлены в конструктор
    cy.get(constructorIngredientSelector)
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
    cy.get(constructorIngredientSelector)
      .contains('Соус Spicy-X')
      .should('exist');
  });

  it('should open and close modal', function () {
    // Открываем модальное окно
    cy.get(bunIngredientSelector)
      .contains('Краторная булка N-200i')
      .click();

    // Проверяем, что модальное окно открылось
    cy.get(modalIngredientSelector)
      .contains('Детали ингредиента')
      .should('exist');
    cy.get(modalIngredientSelector)
      .contains('Краторная булка N-200i')
      .should('exist');

    // Закрываем модальное окно
    cy.get(closeButtonSelector).click();

    // Проверяем, что модальное окно закрыто
    cy.get(modalIngredientSelector).should('not.exist');
  });

  it('should open and close on overlay modal', function () {
    // Открываем модальное окно
    cy.get(bunIngredientSelector)
      .contains('Краторная булка N-200i')
      .click();

    // Проверяем, что модальное окно открылось
    cy.get(modalIngredientSelector)
      .contains('Детали ингредиента')
      .should('exist');

    // Закрываем модальное окно через клик по overlay
    cy.get(closeButtonSelector).trigger('click', {
      clientX: 100,
      clientY: -100
    });

    // Проверяем, что модальное окно закрыто
    cy.get(modalIngredientSelector).should('not.exist');
  });
});

//==================================

describe('create order correctly', function () {
  beforeEach(function () {
    // Устанавливаем токены для аутентификации
    cy.window().then((window) => {
      window.localStorage.setItem('refreshToken', 'fakeRefreshToken');
    });
    cy.setCookie('accessToken', 'fakeAccessToken');

    // Перехватываем запросы API
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });

    // Мокаем запрос на создание заказа
    cy.intercept('POST', 'api/orders', (req) => {
      expect(req.body.ingredients).to.eql([
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093c'
      ]);
      req.reply({ delay: 1000, fixture: 'post_order.json' });
    });

    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000/');
  });

  afterEach(() => {
    // Очистка localStorage
    cy.window().then((window) => {
      window.localStorage.removeItem('refreshToken');
    });

    // Очистка cookie
    cy.clearCookie('accessToken');
  });

  it('should add bun, ingredient and make successful order', function () {
    // Проверяем, что булка и ингредиенты отсутствуют в конструкторе
    cy.get('[data-cy=constructor-bun-1]').should('not.exist');
    cy.get('[data-cy=constructor-bun-2]').should('not.exist');
    cy.get(constructorIngredientSelector)
      .contains('Выберите начинку')
      .should('exist');

    // Добавляем булку и ингредиент
    cy.get(bunIngredientSelector).contains('Добавить').click();
    cy.get('[data-cy=main-ingredients]').contains('Добавить').click();

    // Оформляем заказ
    cy.get('[data-cy=buttonExecuteOrder]').click();

    // Проверяем, что заказ оформляется
    cy.get('[data-cy=modal-orderLoader]')
      .contains('Оформляем заказ...')
      .should('exist');

    // Проверяем, что заказ успешно оформлен
    cy.get(modalSuccessOrderSelector).should('exist');
    cy.get(modalSuccessOrderSelector).contains('12345').should('exist');

    // Закрываем модальное окно
    cy.get(closeButtonSelector).click();
    cy.get(modalSuccessOrderSelector).should('not.exist');

    // Проверяем, что конструктор пуст после завершения заказа
    cy.get('[data-cy=constructor-bun-1]').should('not.exist');
    cy.get('[data-cy=constructor-bun-2]').should('not.exist');
    cy.get(constructorIngredientSelector)
      .contains('Выберите начинку')
      .should('exist');
  });
});
