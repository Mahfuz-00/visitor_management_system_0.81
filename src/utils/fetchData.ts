// export const baseUrl = "https://epass.touchandsolve.com";
// export const baseUrl = "http://103.98.64.8";
export const baseUrl = "http://160.191.150.185:9043";

export const postImage = async (url: string, post: any, token: string) => {
    const res = await fetch(`${baseUrl}/api/${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        },
        body: post
    });

    console.log('Request URL:', `${baseUrl}/api/${url}`);
    console.log('Request Body:', post);
    console.log('Response Status:', res.status);

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

    console.log('Request URL:', `${baseUrl}/api/${url}`);
    console.log('Response Status:', res.status);

    const data = await res.json();
    return data;
};

export const postData = async (url: string, post: any, token?: string) => {
  const fullUrl = `${baseUrl}/api/${url}`;
  
  console.log('=== POST REQUEST START ===');
  console.log('Full URL:', fullUrl);
  console.log('Payload (raw):', post);
  console.log('Payload (stringified):', JSON.stringify(post, null, 2));
  console.log('Token present?', !!token);
  console.log('Token value:', token || '(none)');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    console.log('FETCH TIMEOUT (15s) - aborted');
  }, 15000);

  try {
    const res = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(post),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('=== RESPONSE RECEIVED ===');
    console.log('Status:', res.status);
    console.log('OK:', res.ok);
    console.log('Headers:', [...res.headers.entries()]);

    const text = await res.text();
    console.log('Raw body:', text);

    let data; 
    try {
      data = JSON.parse(text);
      console.log('Parsed JSON:', data);
    } catch (e: unknown) {
      console.log('JSON parse failed:', e instanceof Error ? e.message : 'Unknown error');
      data = { rawText: text };
    }

    console.log('=== POST REQUEST END ===\n');
    return data;
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.log('=== FETCH ERROR ===');
    console.log('Name:', err.name);
    console.log('Message:', err.message);
    console.log('Stack:', err.stack);
    console.log('=== POST REQUEST FAILED ===\n');
    throw err;
  }
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

    console.log('Request URL:', `${baseUrl}/api/${url}`);
    console.log('Request Body:', JSON.stringify(post));
    console.log('Response Status:', res.status);

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

    console.log('Request URL:', `${baseUrl}/api/${url}`);
    console.log('Request Body:', JSON.stringify(post));
    console.log('Response Status:', res.status);

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


    console.log('Request URL:', `${baseUrl}/api/${url}`);
    console.log('Response Status:', res.status);

    const data = await res.json();
    return data;
};