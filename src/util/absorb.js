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

Absorb.createFolder = folderName => {
  const url = `${baseUrl}/folders`;
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({folderName: folderName})
  };
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve([]));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse.folders.map(folder => camelcaseKeys(folder));
    });
});
};

Absorb.getFolderItemsByFolderName = folderName => {
  const url = `${baseUrl}/folders/${folderName}/folder-items`;

  return fetch(url).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve([]));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse.folderItems.map(folderItem => camelcaseKeys(folderItem));
    })
  })
}


Absorb.getFolderItemsContent = (folderName, selected) => {
  const url = `${baseUrl}/folders/${folderName}/folder-items/${selected}`;

  return fetch(url).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve([]));
    }
    return response.json()
  })
}

Absorb.getAllFolderItems = () => {

  const url = `${baseUrl}/folders/folderItems`;

  return fetch(url).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve([]));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse.folderItems.map(folderItem => camelcaseKeys(folderItem));
    })
  })
}


Absorb.saveEntry = (folderName, newEntryItems) => {

  const url = `${baseUrl}/folders/${folderName}/folder-items`;
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({newEntryItems: newEntryItems})
  };
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse.folderItems.map(folderItem => camelcaseKeys(folderItem));
    });
  });
};

Absorb.updateEntry = (folderName, newEntryItems) => {

  const url = `${baseUrl}/folders/${folderName}/folder-items`;
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({newEntryItems: newEntryItems})
  };
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse.folderItems.map(folderItem => camelcaseKeys(folderItem));
    });
  });
};


Absorb.deleteEntry = (folderName, id) => {
  const url = `${baseUrl}/folders/${folderName}/folder-items/${id}`;
  const fetchOptions = {
    method: 'DELETE'
  };
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse.folderItems.map(folderItem => camelcaseKeys(folderItem));
    });
  });
};

Absorb.deleteFolder = (folderName) => {
  const url = `${baseUrl}/folders/${folderName}`;
  const fetchOptions = {
    method: 'DELETE'
  };
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve([]));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse.folders.map(folder => camelcaseKeys(folder));
    });
});
};


export default Absorb;

