import { useState } from 'react';
import { AppContainer } from './App.styled';
import { SearchbarForm } from 'components/Searchbar/Searchbar';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';

export function App() {
  const [textForm, setTextForm] = useState('');

  return (
    <AppContainer>
      <SearchbarForm onSubmitProps={text => setTextForm(text)} />
      <ImageGallery textForm={textForm} />
    </AppContainer>
  );
}
