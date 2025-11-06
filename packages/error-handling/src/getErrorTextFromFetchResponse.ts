export const getErrorTextFromFetchResponse = async (response: Response) => {
  try {
    const json = await response.clone().json();
    if (json) {
      return JSON.stringify(json);
    }
  } catch (err) {
    // noop
  }

  try {
    const text = await response.clone().text();
    if (text) {
      return text;
    }
  } catch (err) {
    // noop
  }

  return response.statusText;
};
