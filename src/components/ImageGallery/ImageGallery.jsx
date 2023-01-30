import PropTypes from 'prop-types';
import { useState } from 'react';
import { ImageList } from './ImageGallery.styled';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import { TitleVisoutImg } from 'components/App/App.styled';
import { Loader } from 'components/Loader/Loader';
import { Button } from 'components/Button/Button';

export function ImageGallery({ textForm }) {
  const [dataQty, setDataQty] = useState(null);
  const [status, setStatus] = useState('idle');
  const [page, setPage] = useState(1);

  const onClickBtn = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <>
      {textForm && (
        <ImageList>
          <ImageGalleryItem
            onFetchTotal={data => setDataQty(data)}
            textForm={textForm}
            statusFunc={data => setStatus(data)}
            status={status}
            page={page}
          />
        </ImageList>
      )}
      {status === 'pending' && <Loader />}
      {dataQty === 0 && (
        <TitleVisoutImg>Картинки с именем {textForm} нет :(</TitleVisoutImg>
      )}
      {dataQty > 0 && status !== 'pending' && (
        <Button onClickBtn={onClickBtn} />
      )}
    </>
  );
}

ImageGallery.propTypes = {
  textForm: PropTypes.string.isRequired,
};
