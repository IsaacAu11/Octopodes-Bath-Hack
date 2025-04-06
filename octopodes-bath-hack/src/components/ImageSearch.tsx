interface PixabayResponse {
  hits: {
    id: number;
    webformatURL: string;
    previewURL: string;
    largeImageURL: string;
    tags: string;
  }[];
  total: number;
  totalHits: number;
}

export async function searchImage(searchTerm: string): Promise<string> {
  if (!searchTerm.trim()) {
    return "";
  }

  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${import.meta.env.VITE_PIXABAY_API_KEY}&q=${encodeURIComponent(
        searchTerm
      )}&image_type=photo&per_page=3&safesearch=true`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const data: PixabayResponse = await response.json();
    return data.hits.length > 0 ? data.hits[0].webformatURL : "";
  } catch (error) {
    console.error('Error fetching image:', error);
    return "";
  }
} 