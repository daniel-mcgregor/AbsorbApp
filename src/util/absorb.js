// write api functions
import camelcaseKeys from './camelcase-keys/index';
import 'whatwg-fetch';

const Absorb = {};
const baseUrl = 'http://localhost:4001/api';

Absorb.getFolders = () => {
    const url = `${baseUrl}/folders`;
  
    return fetch(url).then(response => {
      if (!response.ok) {
        return new Promise(resolve => resolve([]));
      }
      return response.json().then(jsonResponse => {
        return jsonResponse.folders.map(folder => camelcaseKeys(folder));
      });
  });
};

Absorb.getAllFolderItems = () => {
  const url = `${baseUrl}/folders/folderItems`;

  return fetch(url).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve([]));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse.folderItems.map(folderItem => camelcaseKeys(folderItem))
    })
  })
}



export default Absorb;

