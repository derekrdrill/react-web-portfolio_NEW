import axios from 'axios';

import { handleAlert } from '../../Alert/context/AlertActions';

const YOUTUBE_API_URL = process.env.REACT_APP_YOUTUBE_API_URL;
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const YOUTUBE_API_HOST = process.env.REACT_APP_YOUTUBE_API_HOST;

export const getAllCocktailData = async cocktailDispatch => {
  axios
    .get(`${process.env.REACT_APP_BACKEND_URL}/get-cocktail-names-glasses-ingredients`)
    .then(async response => {
      let data = response.data;

      await cocktailDispatch({ type: 'SET_COCKTAILS', cocktails: data.cocktailData });
      await cocktailDispatch({ type: 'SET_COCKTAIL_NAMES', cocktailNames: data.cocktailNames });
      await cocktailDispatch({ type: 'SET_GLASSES', glasses: data.glassTypes });
      await cocktailDispatch({ type: 'SET_INGREDIENTS', ingredients: data.ingredients });
    });
};

export const getSearchOptions = (searchType, cocktails, ingredients, glasses, cocktailNames) =>
  searchType === 'name' && cocktails.length > 0
    ? cocktailNames
    : searchType === 'ingredients' && ingredients.length > 0
    ? ingredients
    : searchType === 'glass' && glasses.length > 0
    ? glasses
    : [];

export const getCocktails = async (
  alertDispatch,
  cocktailDispatch,
  cocktails,
  searchType,
  selectedIngredients,
  searchData,
) => {
  const newCocktails =
    searchType === 'ingredients'
      ? await getCocktailsByIngredient(cocktails, selectedIngredients)
      : searchType === 'name'
      ? await getCocktailsByName(cocktails, searchData)
      : await getCocktailsByGlass(cocktails, searchData);

  await newCocktails.forEach(async (cocktail, cocktailIndex, searchResults) => {
    const youtubeData = await getCocktailsWithYoutubeData(
      cocktail,
      cocktailDispatch,
      searchResults,
    );

    cocktail.youtubeData = youtubeData;
    cocktail.imageLoading = true;

    newCocktails[cocktailIndex] = cocktail;
  });

  const newCocktailsNoDups = newCocktails.filter(
    (v, i, a) => a.findIndex(v2 => JSON.stringify(v) === JSON.stringify(v2)) === i,
  );

  if (newCocktailsNoDups.length > 0) {
    cocktailDispatch({
      type: 'SET_SEARCH_RESULTS',
      searchResults: newCocktailsNoDups.sort((a, b) =>
        a.strDrink < b.strDrink ? -1 : a.strDrink > b.strDrink ? 1 : 0,
      ),
    });

    cocktailDispatch({
      type: 'SET_SEARCH_RESULTS_LENGTH',
      searchResultsLength: newCocktailsNoDups.length,
    });
  } else {
    if (searchData) {
      handleAlert('No drinks found with those indredients', 'Try again', 'warning', alertDispatch);
    }

    cocktailDispatch({
      type: 'SET_SEARCH_RESULTS',
      searchResults: [],
    });

    cocktailDispatch({
      type: 'SET_SEARCH_RESULTS_LENGTH',
      searchResultsLength: 0,
    });
  }
};

export const getCocktailsByGlass = async (cocktails, searchData) =>
  cocktails.filter(cocktail => searchData === cocktail.strGlass.toUpperCase());

export const getCocktailsByName = async (cocktails, searchData) =>
  cocktails.filter(cocktail => searchData === cocktail.strDrink);

export const getCocktailsByIngredient = (cocktails, selectedIngredients) =>
  cocktails.filter(cocktail => {
    let foundIngredients = [];

    selectedIngredients.forEach(selectedIngredient => {
      for (let i = 1; i <= 15; i++) {
        let ingredient =
          cocktail[`strIngredient${i}`] && cocktail[`strIngredient${i}`].toUpperCase();

        if (ingredient && ingredient.includes(selectedIngredient.toUpperCase())) {
          foundIngredients = [...foundIngredients, ...[ingredient]];
        }
      }
    });

    if (foundIngredients.length >= selectedIngredients.length) {
      let fullMatch = false;

      foundIngredients.forEach(foundIngredient => {
        selectedIngredients.forEach(selectedIngredient => {
          if (foundIngredient.includes(selectedIngredient.toUpperCase())) {
            fullMatch = true;
          } else {
            fullMatch = false;
          }
        });
      });

      if (fullMatch) {
        return cocktail;
      }
    }
  });

export const getCocktailsWithYoutubeData = async (cocktail, cocktailDispatch) => {
  cocktailDispatch({
    type: 'SET_LOADING',
    loading: true,
  });

  const cocktailSearchString = cocktail.strDrink
    .replace(/\s+/g, '-')
    .toLowerCase()
    .split('.')
    .join('');

  const youtubeQueryString = `how-to-make-a-${cocktailSearchString}-${
    cocktail.strCategory === 'Shot' ? 'shot' : 'cocktail'
  }`;

  const options = {
    method: 'GET',
    url: YOUTUBE_API_URL,
    params: { q: youtubeQueryString },
    headers: {
      'X-RapidAPI-Key': YOUTUBE_API_KEY,
      'X-RapidAPI-Host': YOUTUBE_API_HOST,
    },
  };

  const result = await axios(options).catch(e => console.log(e));

  cocktail.youtubeData = result.data.videos[0];

  cocktailDispatch({
    type: 'SET_LOADING',
    loading: false,
  });

  return result.data.videos[0];
};

export const handleSearchBarChange = async (
  alertDispatch,
  cocktailDispatch,
  searchData,
  searchType,
  cocktails,
  searchResults,
) => {
  if (searchType === 'name' || searchType === 'glass') {
    getCocktails(
      alertDispatch,
      cocktailDispatch,
      cocktails,
      searchType,
      null,
      searchData,
      searchResults,
    );
  } else {
    let newSearchData =
      searchData.length > 3
        ? searchData.filter((searchItem, searchItemKey) => searchItemKey !== 2)
        : searchData;

    cocktailDispatch({
      type: 'SET_SELECTED_INGREDIENTS',
      selectedIngredients: newSearchData,
    });
  }
};

export const setSearchType = (e, cocktailDispatch) => {
  cocktailDispatch({
    type: 'SET_SEARCH_TYPE',
    searchType: e.target.value,
  });

  cocktailDispatch({
    type: 'SET_SEARCH_RESULTS',
    searchResults: null,
  });

  cocktailDispatch({
    type: 'SET_SEARCH_RESULTS_LENGTH',
    searchResultsLength: 0,
  });

  cocktailDispatch({
    type: 'SET_SELECTED_INGREDIENTS',
    selectedIngredients: [],
  });
};
