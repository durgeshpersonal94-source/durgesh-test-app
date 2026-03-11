import { json, type ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/react';

export const action: ActionFunction = async ({ request, params }) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { id } = params;
  const customerId = 'gid://shopify/Customer/123456789'; // From session in real app

  if (!id) {
    return json({ error: 'Address ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `http://localhost:8001/api/addresses/${customerId}/${id}/setDefault`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      return redirect('/addresses');
    }

    return json({ error: data.message || 'Failed to set default address' });
  } catch (error) {
    return json(
      { error: 'Failed to set default address. Make sure the server is running.' },
      { status: 500 }
    );
  }
};

export const loader = () => redirect('/addresses');
