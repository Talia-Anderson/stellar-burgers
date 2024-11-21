/// <reference types="cypress" />
export {};
const bunIngredientSelector = '[data-cy=bun-ingredients]';
const constructorIngredientSelector ='[data-cy=constructor-ingredients]';
const modalIngredientSelector ='[data-cy=modal-ingredient]';
const closeButtonSelector = '[data-cy=closeButton]';
const modalSuccessOrderSelector = '[data-cy=modal-successOrder]';

describe('add ingredients to constructor works correctly', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000/');
  });




  it('should add bun', function () {
    cy.get(bunIngredientSelector).contains('Добавить').click();
    cy.get('[data-cy=constructor-bun-1]')
      .contains('Краторная булка N-200i (верх)')
      .should('exist');
    cy.get('[data-cy=constructor-bun-2]')
      .contains('Краторная булка N-200i (низ)')
      .should('exist');
  });

  it('should add ingredient', function () {
    cy.get('[data-cy=main-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=sauces-ingredients]').contains('Добавить').click();
    cy.get(constructorIngredientSelector)
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
    cy.get(constructorIngredientSelector)
      .contains('Соус Spicy-X')
      .should('exist');
  });

  it('should open and close modal', function () {
    cy.get(bunIngredientSelector)
      .contains('Краторная булка N-200i')
      .click();

    cy.get(modalIngredientSelector)
      .contains('Детали ингредиента')
      .should('exist');

    cy.get(modalIngredientSelector)
      .contains('Краторная булка N-200i')
      .should('exist');

    cy.get(closeButtonSelector).click();
    cy.get(modalIngredientSelector).should('not.exist');
  });

  it('should open and close on overlay modal ', function () {
    cy.get(bunIngredientSelector)
      .contains('Краторная булка N-200i')
      .click();

    cy.get(modalIngredientSelector)
      .contains('Детали ингредиента')
      .should('exist');

    cy.get(closeButtonSelector).trigger('click', {
      clientX: 100,
      clientY: -100
    });
    cy.get(modalIngredientSelector).should('not.exist');
  });
});

//==================================

describe('create order correctly', function () {
  beforeEach(function () {
    cy.window().then((window) => {
      window.localStorage.setItem('refreshToken', 'fakeRefreshToken');
    });
    cy.setCookie('accessToken', 'fakeAccessToken');

    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });

    cy.intercept('POST', 'api/orders', (req) => {
      expect(req.body.ingredients).to.eql([
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093c'
      ]);
      req.reply({  delay: 1000, fixture: 'post_order.json' });
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
    cy.get(bunIngredientSelector).contains('Добавить').click();
    cy.get('[data-cy=main-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=buttonExecuteOrder]').click();
    cy.get('[data-cy=buttonExecuteOrder]').click();
    cy.get('[data-cy=modal-orderLoader]')
      .contains('Оформляем заказ...')
      .should('exist');
    cy.get(modalSuccessOrderSelector).should('exist');
    cy.get(modalSuccessOrderSelector).contains('12345').should('exist');

    cy.get(closeButtonSelector).click();
    cy.get(modalSuccessOrderSelector).should('not.exist');

    cy.get('[data-cy=constructor-bun-1]').should('not.exist');
    cy.get('[data-cy=constructor-bun-2]').should('not.exist');
    cy.get(constructorIngredientSelector)
      .contains('Выберите начинку')
      .should('exist');
  });
});


