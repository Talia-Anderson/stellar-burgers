import { v4 as uuid } from 'uuid';
import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from './constructorSlice';
import { TConstructorIngredient } from '@utils-types';

// Мокаем uuid для консистентности
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid')
}));

describe('constructorSlice reducer tests', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun: TConstructorIngredient = {
    calories: 420,
    carbohydrates: 53,
    fat: 24,
    image: "https://code.s3.yandex.net/react/code/bun-02.png",
    image_large: "https://code.s3.yandex.net/react/code/bun-02-large.png",
    image_mobile: "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
    name: "Краторная булка N-200i",
    price: 1255,
    proteins: 80,
    type: "bun",
    _id: "643d69a5c3f7b9001cfa093c",
    id: "1"
  };

  const mockIngredient: TConstructorIngredient = {
    calories: 420,
    carbohydrates: 53,
    fat: 24,
    image: "https://code.s3.yandex.net/react/code/bun-02.png",
    image_large: "https://code.s3.yandex.net/react/code/bun-02-large.png",
    image_mobile: "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
    name: "Краторная булка N-200i",
    price: 1255,
    proteins: 80,
    type: "bun",
    _id: "643d69a5c3f7b9001cfa093c",
    id: "1"
  };

  test('should return the initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('should handle addIngredient (bun)', () => {
    const action = addIngredient(mockBun);
    const newState = reducer(initialState, action);
    expect(newState.bun).toEqual({
      ...mockBun,
      id: 'test-uuid'
    });
    expect(newState.ingredients).toHaveLength(0);
  });

  test('should handle addIngredient (non-bun)', () => {
    const action = addIngredient(mockIngredient);
    const newState = reducer(initialState, action);
    expect(newState.ingredients).toEqual([
      {
        ...mockIngredient,
        id: 'test-uuid'
      }
    ]);
    expect(newState.bun).toBeNull();
  });

  test('should handle removeIngredient', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [mockIngredient]
    };
    const action = removeIngredient(0);
    const newState = reducer(stateWithIngredients, action);
    expect(newState.ingredients).toHaveLength(0);
  });

  test('should handle moveIngredientUp', () => {
    const stateWithMultipleIngredients = {
      ...initialState,
      ingredients: [
        { ...mockIngredient, id: 'id-1' },
        { ...mockIngredient, id: 'id-2' }
      ]
    };
    const action = moveIngredientUp(1);
    const newState = reducer(stateWithMultipleIngredients, action);
    expect(newState.ingredients[0].id).toEqual('id-2');
    expect(newState.ingredients[1].id).toEqual('id-1');
  });

  test('should handle moveIngredientDown', () => {
    const stateWithMultipleIngredients = {
      ...initialState,
      ingredients: [
        { ...mockIngredient, id: 'id-1' },
        { ...mockIngredient, id: 'id-2' }
      ]
    };
    const action = moveIngredientDown(0);
    const newState = reducer(stateWithMultipleIngredients, action);
    expect(newState.ingredients[0].id).toEqual('id-2');
    expect(newState.ingredients[1].id).toEqual('id-1');
  });

  test('should handle clearConstructor', () => {
    const stateWithData = {
      bun: mockBun,
      ingredients: [mockIngredient]
    };
    const newState = reducer(stateWithData, clearConstructor());
    expect(newState).toEqual(initialState);
  });
});
