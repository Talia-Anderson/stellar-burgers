import { RootState } from '../services/store';
import { TConstructorIngredient, TOrder, TIngredient } from '../utils/types';

export const selectIngredientById = (
  state: RootState,
  id: string
): TIngredient | undefined =>
  state.ingredients.ingredients.find((ingredient) => ingredient._id === id);
// Селекторы

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectOrder = (state: RootState) => state.orders.order;
export const selectOrderRequest = (state: RootState) => state.orders.loading;
export const selectOrderError = (state: RootState) => state.orders.error;

export const orderDataSelector = (number: string) => (state: RootState) => {
  if (state.orders.orders.length) {
    const data = state.orders.orders.find((item) => item.number === +number);
    if (data) return data;
  }

  if (state.feeds.orders.length) {
    const data = state.feeds.orders.find((item) => item.number === +number);
    if (data) return data;
  }

  if (state.orders.order?.number === +number) {
    return state.orders.order;
  }
  return null;
};
export const ingredientsDataSelector = (state: RootState) =>
  state.ingredients.ingredients;

export const selectOrderModalData = (state: RootState): TOrder | null =>
  state.orders.order || null;

// Селектор для получения состояния загрузки заказов
export const selectOrderLoading = (state: RootState): boolean =>
  state.orders.loading;

// Селектор для получения состояния загрузки ингредиентов
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;

// Селектор для получения ошибки загрузки ингредиентов
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

// Селектор для получения ингредиентов конструктора
export const selectConstructorItems = (
  state: RootState
): {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
} => state.burgerConstructor || { bun: null, ingredients: [] };

export const selectUserName = (state: RootState) => state.user.name;
export const selectUserEmail = (state: RootState) => state.user.email;
export const selectUserStatus = (state: RootState) => state.user.status;
