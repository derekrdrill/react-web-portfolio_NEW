import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/fontawesome-free-solid';

import { CocktailContext } from '../../Cocktail/context/CocktailContext';
import { DarkLightModeContext } from '../../DarkLightMode/context/DarkLightModeContext';

const CocktailData = ({ searchResult, searchResultKey }) => {
  const [mainImageLoading, setMainImageLoading] = React.useState(true);
  const [youtubeImageLoading, setYoutubeImageLoading] = React.useState(true);

  const { searchResultsLength } = React.useContext(CocktailContext);
  const { darkMode } = React.useContext(DarkLightModeContext);

  console.log(searchResult);

  return (
    <CocktailResultsContainer container rowSpacing={4}>
      {(mainImageLoading || youtubeImageLoading) && (
        <Grid container>
          <Grid item xs={1} sm={3} />
          <CocktailDataOverlay item xs={10} sm={6}>
            <Grid container justifyContent='space-around'>
              <Typography variant='h4' textAlign='center'>
                Still Loading...
              </Typography>
              <CircularProgress />
            </Grid>
          </CocktailDataOverlay>
        </Grid>
      )}
      <Grid item xs={1} md={2} />
      <Grid item xs={11} md={3}>
        <Grid container>
          <Grid item xs={12}>
            {mainImageLoading && <CocktailImageLoader />}
          </Grid>
          <Grid item xs={12}>
            <CocktailImage
              alt='cocktail-image'
              src={searchResult.strDrinkThumb}
              onLoad={() => {
                setMainImageLoading(false);
              }}
              loading={mainImageLoading}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={1} sm={1} />
      <Grid item xs={10} md={5}>
        <Typography variant='h3'>{searchResult.strDrink}</Typography>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography variant='h5'>Ingredients</Typography>
            {Object.keys(searchResult)
              .filter(result => result.includes('strIngredient'))
              .map(
                (ingredient, ingredientKey) =>
                  searchResult[ingredient] && (
                    <Typography key={`${searchResult.idDrink}${ingredientKey}`} variant='subtitle2'>
                      {`${searchResult[`strMeasure${ingredientKey + 1}`] ?? ''} ${
                        searchResult[ingredient]
                      }`}
                    </Typography>
                  ),
              )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant='h5'>Glass</Typography>
            <Typography variant='subtitle2'>{searchResult.strGlass}</Typography>
          </Grid>
        </Grid>
        <br />
        <Typography variant='h5'>Instructions</Typography>
        <Typography variant='body2'>{searchResult.strInstructions}</Typography>
        {searchResult.youtubeData && (
          <CocktailVideoTutorialLinkContainer item xs={12} loading={youtubeImageLoading}>
            <CocktailVideoTutorialLink
              href={searchResult.youtubeData.link}
              loading={youtubeImageLoading}
              target='_blank'
              rel='noreferrer'
            >
              <CocktailVideoTutorial
                alt='youtube-how-to'
                className='youtube-img'
                loading={youtubeImageLoading}
                onLoad={() => {
                  setYoutubeImageLoading(false);
                }}
                src={searchResult.youtubeData.thumbnail}
              />
              <CocktailVideoTutorialIconContainer>
                {youtubeImageLoading ? (
                  <CircularProgress />
                ) : (
                  <CocktailVideoTutorialPlayButton icon={faPlayCircle} />
                )}
              </CocktailVideoTutorialIconContainer>
              <CocktailVideoTutorialTitleContainer className='youtube-title'>
                <CocktailVideoTutorialText variant='body1'>
                  {searchResult.youtubeData.title}
                </CocktailVideoTutorialText>
                <CocktailVideoTutorialText variant='subtitle2'>
                  {searchResult.youtubeData.duration}
                </CocktailVideoTutorialText>
              </CocktailVideoTutorialTitleContainer>
            </CocktailVideoTutorialLink>
          </CocktailVideoTutorialLinkContainer>
        )}
      </Grid>
      <Grid xs={1} />
      <Grid xs={1} />
      <CocktailResultsDivider
        item
        xs={10}
        darkMode={darkMode}
        lastItem={searchResultKey + 1 === searchResultsLength}
      />
      <Grid xs={1} />
    </CocktailResultsContainer>
  );
};

CocktailData.propTypes = {
  searchResult: PropTypes.object,
  searchResultKey: PropTypes.number,
};

export default CocktailData;

export const CocktailDataOverlay = styled(Grid)({
  backgroundColor: 'rgba(142, 142, 141, 1.0)',
  borderRadius: 10,
  color: 'rgba(142, 142, 141, 0.8)',
  transform: 'translateY(20vh)',
  zIndex: 4,
});

export const CocktailImageLoader = styled(CircularProgress)({
  position: 'relative',
  left: 10,
  top: 60,
  zIndex: 2,
});

export const CocktailImage = styled.img(({ loading }) => [
  {
    borderRadius: 30,
    height: 275,
    width: 320,
    zIndex: 0,
  },
  loading && {
    filter: 'blur(8px)',
    '-webkit-filter': 'blur(8px)',
  },
]);

export const CocktailResultsContainer = styled(Grid)({
  padding: '40px 0',
});

export const CocktailResultsDivider = styled(Grid)(({ darkMode, lastItem }) => ({
  borderBottom: !lastItem && `solid 1px ${darkMode ? 'gainsboro' : 'grey'}`,
  margin: '0 30px',
  padding: '50px 0',
}));

export const CocktailVideoTutorial = styled.img(({ loading }) => [
  {
    height: 215,
    width: 315,
  },
  loading && {
    filter: 'blur(8px)',
    '-webkit-filter': 'blur(8px)',
  },
]);

export const CocktailVideoTutorialIconContainer = styled.div({
  transform: 'translate(145px, -130px)',
});

export const CocktailVideoTutorialLinkContainer = styled(Grid)(({ loading }) => ({
  ':hover': {
    '.youtube-img': {
      opacity: !loading && 0.4,
    },
  },
  height: 215,
  transform: 'translateY(20px)',
  width: 315,
}));

export const CocktailVideoTutorialTitleContainer = styled.div({
  maxWidth: 300,
  transform: 'translate(10px, -250px)',
});

export const CocktailVideoTutorialLink = styled.a(({ loading }) => ({
  cursor: loading ? 'not-allowed' : 'pointer',
  pointerEvents: loading && 'none',
  textDecoration: 'none',
  zIndex: 2,
}));

export const CocktailVideoTutorialPlayButton = styled(FontAwesomeIcon)({
  color: 'red',
  height: 30,
  width: 30,
});

export const CocktailVideoTutorialText = styled(Typography)({
  color: 'white',
  fontWeigt: 'bold',
  zIndex: 0,
});
