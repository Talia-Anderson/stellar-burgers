import { TIngredient } from '../utils/types';
import { fetchIngredients } from '../slices/ingredientsSlice';
import mockIngredients from '../__mocks__/ingredients.json';

import ingredientsReducer, { IngredientsState } from '../slices/ingredientsSlice';

describe('Тесты для slice ingredients', () => {
  test('Тест fetchIngredients.pending', () => {
    const customInitialState: IngredientsState = {
      isLoading: false,
      ingredients: [],
      error: null
    };
    
    const initialState = ingredientsReducer(customInitialState, {
      type: '@@INIT'
    });

    const newState = ingredientsReducer(
      initialState,
      fetchIngredients.pending('fetchIngredientsPending')
    );
    
    expect(newState.isLoading).toEqual(true);
    expect(newState.error).toBeNull();
  });

  test('Тест fetchIngredients.fulfilled', () => {
    const customInitialState: IngredientsState = {
      isLoading: true,
      ingredients: [],
      error: null
    };
    
    const initialState = ingredientsReducer(customInitialState, {
      type: '@@INIT'
    });

    const payload: TIngredient[] = mockIngredients;
    const newState = ingredientsReducer(
      initialState,
      fetchIngredients.fulfilled(payload, 'fetchIngredientsFulfilled')
    );

    expect(newState.isLoading).toEqual(false);
    expect(newState.ingredients).toEqual(mockIngredients);
    expect(newState.error).toBeNull();
  });

  test('Тест fetchIngredients.rejected', () => {
    const customInitialState: IngredientsState = {
      isLoading: true,
      ingredients: [],
      error: null
    };
    
    const initialState = ingredientsReducer(customInitialState, {
      type: '@@INIT'
    });

    const testError = new Error('Test Error');
    const newState = ingredientsReducer(
      initialState,
      fetchIngredients.rejected(testError, 'fetchIngredientsRejected')
    );

    expect(newState.isLoading).toEqual(false);
    expect(newState.error).toEqual('Test Error');
  });
});
