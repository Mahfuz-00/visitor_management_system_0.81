// export const baseUrl = "https://epass.touchandsolve.com";
export const baseUrl = "http://103.98.64.8";

export const postImage = async (url: string, post: any, token: string) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    },
    body: post
  });

  const data = await res.json();
  return data;
};

export const getData = async (url: string, token: string) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await res.json();
  return data;
};

export const postData = async (url: string, post: any, token: string) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(post)
  });

  const data = await res.json();
  return data;
};

export const putData = async (url: string, post: any, token: string) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(post)
  });

  const data = await res.json();
  return data;
};

export const patchData = async (url: string, post: any, token: string) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(post)
  });

  const data = await res.json();
  return data;
};

export const deleteData = async (url: string, token: string) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await res.json();
  return data;
};