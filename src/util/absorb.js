// write api functions
import camelcaseKeys from './camelcase-keys/index';
import 'whatwg-fetch';

const Absorb = {};
const baseUrl = 'https://absorb.herokuapp.com:39744/api';

Absorb.getFolders = (userId) => {
    const url = `${baseUrl}/folders`;
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem("token")
      },
      body: JSON.stringify({userId: userId})
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

Absorb.createFolder = (folderName, userId) => {
  const url = `${baseUrl}/folders/newFolder`;
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")
    },
    body: JSON.stringify({folderName: folderName, userId: userId})
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

Absorb.getFolderItemsByFolderName = (folder, userId) => {
  const folderName = encodeURIComponent(folder);
  const url = `${baseUrl}/folders/${folderName}/folder-items/returnFolderItems`;

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")
    },
    body: JSON.stringify({userId: userId})
  };

  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve([]));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse.folderItems.map(folderItem => camelcaseKeys(folderItem));
    })
  })
}

Absorb.getFolderItemsByCategory = (folder, low, high, userId) => {
  const folderName = encodeURIComponent(folder);
  const url = `${baseUrl}/folders/${folderName}/folder-items/${low}/${high}`;
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")
    },
    body: JSON.stringify({userId: userId})
  };
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve([]));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse.folderItems.map(folderItem => camelcaseKeys(folderItem));
    })
  })
}


Absorb.getFolderItemsContent = (folder, selected, userId) => {
  
  const folderName = encodeURIComponent(folder);
  const select = encodeURIComponent(selected);

  const url = `${baseUrl}/folders/${folderName}/folder-items/${select}`;
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")
    },
    body: JSON.stringify({userId: userId})
  };

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


Absorb.saveEntry = (folder, newEntryItems, userId) => {

  const folderName = encodeURIComponent(folder);

  const url = `${baseUrl}/folders/${folderName}/folder-items`;
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")

    },
    body: JSON.stringify({newEntryItems: newEntryItems, userId: userId})
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

Absorb.logout = () => {
  const url = `${baseUrl}/users/logout`;
  const fetchOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")
    },
    credentials: 'include'
  };
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json();
  });
}

Absorb.checkEmail = (email) => {

  const url = `${baseUrl}/users/check`;
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email: email})
  };
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse;
    });
  });
};



Absorb.return = () => {
  const url = `${baseUrl}/users/login`;

  const fetchOptions = {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")
    },
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



Absorb.updateEntry = (folder, newEntryItems, userId) => {
  const folderName = encodeURIComponent(folder);
  const url = `${baseUrl}/folders/${folderName}/folder-items`;
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")
    },
    body: JSON.stringify({newEntryItems: newEntryItems, userId: userId})
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

Absorb.increaseScore = (folder, entry, userId) => {
  const folderName = encodeURIComponent(folder);
  const url = `${baseUrl}/folders/${folderName}/folder-items/${entry}/plus`;
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")
    },
    body: JSON.stringify({userId: userId})
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


Absorb.deleteEntry = (folder, id, userId) => {
  const folderName = encodeURIComponent(folder);
  const url = `${baseUrl}/folders/${folderName}/folder-items/${id}`;
  const fetchOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("token")
    },
    body: JSON.stringify({userId: userId})
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



Absorb.deleteFolder = (folder, userId) => {
  const folderName = encodeURIComponent(folder);
  const url = `${baseUrl}/folders/${folderName}/${userId}`;
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

