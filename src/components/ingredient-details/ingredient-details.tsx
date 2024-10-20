import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { selectIngredientById } from '../routers/selectors';
import { RootState } from 'src/services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>(); // Получаем ID ингредиента из параметров

  // Проверяем, что id не undefined, прежде чем использовать селектор
  if (!id) {
    return <p>Ингредиент не найден</p>;
  }

  const ingredientData = useSelector((state: RootState) =>
    selectIngredientById(state, id)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
