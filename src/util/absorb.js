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

Absorb.getEntries = folderName => {
  const url = `${baseUrl}/folderItems/${folderName}`;

  return fetch(url).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve([]));
      
    }
    return response.json().then(jsonResponse => {
      return jsonResponse.folderItems;
    })
  })
}



export default Absorb;

