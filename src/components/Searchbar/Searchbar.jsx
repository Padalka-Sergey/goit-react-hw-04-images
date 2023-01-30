import { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Btn, Input, Searhbar, BtnSpan } from './Searchbar.styled';

export function SearchbarForm({ onSubmitProps }) {
  const [textFormLetter, settextFormLetter] = useState('');

  const handleTextFormChange = event => {
    const evtValue = event.currentTarget.value.toLowerCase();
    settextFormLetter(evtValue);
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (textFormLetter.trim() === '') {
      alert('Введите текст');
      return;
    }

    onSubmitProps(textFormLetter);
  };

  return (
    <Searhbar>
      <Form onSubmit={handleSubmit}>
        <Btn type="submit">
          <BtnSpan>Search</BtnSpan>
        </Btn>
        <Input
          type="text"
          name="textForm"
          value={textFormLetter}
          onChange={handleTextFormChange}
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </Form>
    </Searhbar>
  );
}

SearchbarForm.propTypes = {
  onSubmitProps: PropTypes.func.isRequired,
};
