import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { GalleryItem, Img } from './ImageGalleryItem.styled';
import { AddModal } from 'components/Modal/Modal';
import fetchAPI from 'services/fetch-api';

let pageNorm;
let response;
export function ImageGalleryItem({
  textForm,
  onFetchTotal,
  page,
  statusFunc,
  status,
}) {
  const [responseData, setResponseData] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idImg, setIdImg] = useState(null);

  const isFirstRender = useRef(true);
  const isFirstRender2 = useRef(true);

  const closeModal = evt => {
    const { tagName } = evt.target;
    if (tagName === 'IMG') {
      return;
    }
    setIsModalOpen(false);
  };

  const openModal = evt => {
    const { tagName } = evt.target;
    const evtTarget = Number(evt.target.getAttribute('id'));

    if (tagName !== 'IMG') {
      return;
    }
    setIsModalOpen(true);
    setIdImg(evtTarget);
  };

  const handleKeyDown = evt => {
    if (evt.code === 'Escape') {
      setIsModalOpen(false);
    }
  };

  const onResponseDataFetch = responseDataFetch => {
    return responseDataFetch.hits.map(
      ({ id, webformatURL, tags, largeImageURL }) => {
        return { id, webformatURL, tags, largeImageURL };
      }
    );
  };

  const onFetchAPI = (total, nextText) => {
    fetchAPI
      .fetchApi(nextText, pageNorm)
      .then(responseDataFetch => {
        localStorage.setItem(
          'data',
          JSON.stringify(onResponseDataFetch(responseDataFetch))
        );
        setResponseData(onResponseDataFetch(responseDataFetch));

        total(responseDataFetch.total);
        statusFunc('resolved');
      })
      .catch(error => {
        setError(error);
        statusFunc('rejected');
      });
  };

  useEffect(() => {
    localStorage.clear();
    pageNorm = 1;
    statusFunc('pending');
    onFetchAPI(onFetchTotal, textForm);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      console.log(isFirstRender.current);
      isFirstRender.current = false;
      return;
    }
    localStorage.removeItem('data');
    setResponseData([]);
    statusFunc('pending');
    pageNorm = 1;

    onFetchAPI(onFetchTotal, textForm);
  }, [textForm]);

  useEffect(() => {
    if (isFirstRender2.current) {
      console.log(isFirstRender2.current);
      isFirstRender2.current = false;
      return;
    }
    if (pageNorm === 1) {
      pageNorm = 2;
    }
    statusFunc('pending');

    fetchAPI
      .fetchApi(textForm, pageNorm)
      .then(responseDataFetch => {
        setResponseData(responseDataFetch);
        onFetchTotal(responseDataFetch.total);
        statusFunc('resolved');

        const data = localStorage.getItem('data');
        const parsedData = JSON.parse(data);
        response = [...parsedData, ...onResponseDataFetch(responseDataFetch)];
        localStorage.setItem('data', JSON.stringify(response));

        pageNorm += 1;
      })
      .catch(error => {
        setError(error);
        statusFunc('rejected');
      });
  }, [page]);

  const data = localStorage.getItem('data');
  const parsedData = JSON.parse(data);

  // if (status === 'idle')

  if (status === 'rejected') {
    return <h1>{error.message}</h1>;
  }

  if (parsedData) {
    return parsedData.map(({ id, webformatURL, tags, largeImageURL }) => (
      <GalleryItem key={id}>
        <Img id={id} alt={tags} src={webformatURL} onClick={openModal} />
        {isModalOpen && id === idImg && (
          <AddModal
            id={id}
            tags={tags}
            largeImageURL={largeImageURL}
            onClose={closeModal}
            onKeyDown={handleKeyDown}
          />
        )}
      </GalleryItem>
    ));
  }

  if (status === 'resolved') {
    return (
      <>
        {responseData.map(({ id, webformatURL, tags, largeImageURL }) => {
          return (
            <GalleryItem key={id}>
              <Img id={id} alt={tags} src={webformatURL} onClick={openModal} />

              {isModalOpen && id === idImg && (
                <AddModal
                  id={id}
                  tags={tags}
                  largeImageURL={largeImageURL}
                  onClose={closeModal}
                  onKeyDown={handleKeyDown}
                />
              )}
            </GalleryItem>
          );
        })}
      </>
    );
  }
}

ImageGalleryItem.propTypes = {
  textForm: PropTypes.string.isRequired,
  onFetchTotal: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  statusFunc: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
};
