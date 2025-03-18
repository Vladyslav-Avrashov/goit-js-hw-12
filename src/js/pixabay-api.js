import axios from 'axios';
export async function fetchImages(query, page = 1, perPage = 15) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '49403808-1d10fbc3a3e3dae24bc03a037',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: perPage,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
