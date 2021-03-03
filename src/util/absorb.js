// write api functions
import camelcaseKeys from './camelcase-keys/index';
import 'whatwg-fetch';

const Absorb = {};
const baseUrl = 'http://localhost:4001/api';

Absorb.getFolders = () => {
    const url = `${baseUrl}/folders`;
    const fetchOptions = {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem("token")
      }
    }
  
    return fetch(url, fetchOptions).then(response => {
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
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")
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

Absorb.getFolderItemsByFolderName = folder => {
  const folderName = encodeURIComponent(folder);
  const url = `${baseUrl}/folders/${folderName}/folder-items`;

  const fetchOptions = {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")
    }
  }

  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve([]));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse.folderItems.map(folderItem => camelcaseKeys(folderItem));
    })
  })
}

Absorb.getFolderItemsByCategory = (folder, low, high) => {
  const folderName = encodeURIComponent(folder);
  const url = `${baseUrl}/folders/${folderName}/folder-items/${low}/${high}`;
  const fetchOptions = {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")
    }
  }
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve([]));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse.folderItems.map(folderItem => camelcaseKeys(folderItem));
    })
  })
}


Absorb.getFolderItemsContent = (folder, selected) => {
  
  const folderName = encodeURIComponent(folder);
  const select = encodeURIComponent(selected);

  const url = `${baseUrl}/folders/${folderName}/folder-items/${select}`;
  const fetchOptions = {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")
    }
  }

  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve([]));
    }
    return response.json();
  })
}

Absorb.getAllFolderItems = () => {

  const url = `${baseUrl}/folders/folderItems`;
  const fetchOptions = {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")
    }
  }

  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve([]));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse.folderItems.map(folderItem => camelcaseKeys(folderItem));
    })
  })
}


Absorb.saveEntry = (folder, newEntryItems) => {

  const folderName = encodeURIComponent(folder);

  const url = `${baseUrl}/folders/${folderName}/folder-items`;
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")

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

Absorb.register = (newUser) => {

  const url = `${baseUrl}/users`;
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({newUser: newUser})
  };
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse.user.map(folderItem => camelcaseKeys(folderItem));
    });
  });
};

Absorb.login = (user) => {

  const url = `${baseUrl}/users/login`;
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({user: user}),
    credentials: 'include'
  };
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json();
  });
};

Absorb.return = () => {
  const url = `${baseUrl}/users/login`;

  const fetchOptions = {
    credentials: 'include'
  }

  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve([]));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse;
    });
});
}


Absorb.updateEntry = (folder, newEntryItems) => {
  const folderName = encodeURIComponent(folder);
  const url = `${baseUrl}/folders/${folderName}/folder-items`;
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")
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

Absorb.increaseScore = (folder, entry) => {
  alert("going up again");
  const folderName = encodeURIComponent(folder);
  const url = `${baseUrl}/folders/${folderName}/folder-items/${entry}/plus`;
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")
    }
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


Absorb.deleteEntry = (folder, id) => {
  const folderName = encodeURIComponent(folder);
  const url = `${baseUrl}/folders/${folderName}/folder-items/${id}`;
  const fetchOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")
    }

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

Absorb.deleteFolder = (folder) => {
  const folderName = encodeURIComponent(folder);
  const url = `${baseUrl}/folders/${folderName}`;
  const fetchOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")
    }
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

