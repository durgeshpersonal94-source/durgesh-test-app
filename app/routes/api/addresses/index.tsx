import { json, type LoaderFunction, type ActionFunction } from '@remix-run/node';
import { authenticate } from '~/shopify.server';
import { addAddress, getAddresses, type AddressInput } from '~/services/addressMongo.server';

/**
 * GET /api/addresses?customerId=xxx
 * Fetch all addresses for a customer
 */
export const loader: LoaderFunction = async ({ request }) => {
  if (request.method !== 'GET') {
    return json({ success: false, message: 'Method not allowed' }, { status: 405 });
  }

  try {
    // Get customer ID from query params
    const url = new URL(request.url);
    const customerId = url.searchParams.get('customerId');

    if (!customerId) {
      return json(
        {
          success: false,
          message: 'Customer ID is required',
          error: 'Missing customerId query parameter',
        },
        { status: 400 }
      );
    }

    // Fetch addresses
    const result = await getAddresses(customerId);

    return json(result, { status: result.success ? 200 : 400 });
  } catch (error: any) {
    console.error('Loader error:', error);
    return json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
};

/**
 * POST /api/addresses
 * Create a new address for a customer
 */
export const action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return json({ success: false, message: 'Method not allowed' }, { status: 405 });
  }

  try {
    // Authenticate with Shopify
    const { admin } = await authenticate.admin(request);

    // Parse request body
    let addressData: Partial<AddressInput>;
    try {
      addressData = await request.json();
    } catch (error) {
      return json(
        {
          success: false,
          message: 'Invalid JSON in request body',
          error: 'Failed to parse JSON',
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!addressData.customerId) {
      return json(
        {
          success: false,
          message: 'Customer ID is required',
          error: 'Missing customerId',
        },
        { status: 400 }
      );
    }

    // Create address
    const result = await addAddress(addressData as AddressInput);

    return json(result, { status: result.success ? 201 : 400 });
  } catch (error: any) {
    console.error('Action error:', error);

    // Handle Shopify auth errors
    if (error.status === 401) {
      return json(
        {
          success: false,
          message: 'Unauthorized',
          error: 'Authentication failed',
        },
        { status: 401 }
      );
    }

    return json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
};
